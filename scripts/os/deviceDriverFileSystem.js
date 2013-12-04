/* ----------------------------------
   DeviceDriverFileSystem.js
   
   Requires deviceDriver.js
   
   The Kernel File System Device Driver.
   ---------------------------------- */

DeviceDriverFileSystem.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverFileSystem()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnFileSystemDriverEntry;
    this.isr = krnFileSystemHandler;
    // "Constructor" code.
}

function krnFileSystemDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnFileSystemHandler(args)
{
	switch(args[0])
	{
		case "format":
			//alert("meow");
			DiskFormat();
			break;
		case "create":
			DiskCreate(args[1]);
			break;
		case "read":
			DiskRead(args[1]);
			break;
		case "list":
			DiskList();
			break;
		default:
			response = false; //probably not the best way to deal with this...
			break;
	}
}

DiskFormat = function()
{
	var tsbKey = "";
	var data = "0---~"; //~ being the escape character
	for( var i = 0; i < _FileSize-1; i++)
	{
		data += "-";
	}

	for (var t = 0; t < _HardDrive.tracks; t++) //track loop
	{
		for (var s = 0; s < _HardDrive.sectors; s++) //sector loop
		{
			for (var b = 0; b < _HardDrive.blocks; b++) //block loop
			{
				tsbKey = t.toString() + "," + s.toString() + "," + b.toString(); //create the tsbKey and add it to the disk
				_HardDrive.disk.setItem(tsbKey, data);
			}
		}
	}
	_HardDrive.disk.setItem("0,0,0", "_---MBR");
	formatFlag = 1;
};

	
DiskCreate = function(args)
{
	//alert(_HardDrive.disk.getItem("0,0,0"));
	if(formatFlag === 0) //check if the storage has been formatted
	{
		_StdIn.putText("File Creation Failed, Disk not Formatted.");
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	else
	{
		var args = args.toString(); //necessary as otherwise treated as an array (it gets messy).
		var currentKey = "0,0,1"; //start with the first key, looking at the inUse byte.
		//alert(_HardDrive.disk.key("0,0,1"));
		//alert(currentKey);
		var inUseCheck = _HardDrive.disk.getItem(currentKey);
		var keyToUse = null;
		//alert(inUseCheck);
		
		while(currentKey !== "0,0,0") //check all possible file locations to see if any are empty
		{
			if(parseInt(inUseCheck.substring(0,1)) === 0) //check the inUse byte
			{
				keyToUse = currentKey; //if found, set it for future use and exit the loop
				//alert(keyToUse);
				break;
			}
			currentKey = getNextFileKey(currentKey); //otherwise, get the next tsb
			//alert(currentKey);
			//currentKey = _HardDrive.disk.key(tempKey);
			//alert(currentKey);			
			inUseCheck = _HardDrive.disk.getItem(currentKey);
			//alert(inUseCheck);
		}

		if(keyToUse === null)
		{
			_StdIn.putText("File Creation Failed, Disk Full.");
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
		else
		{
			//_StdIn.putText("Meow!"); //placeholder, I assure you
			//_StdIn.advanceLine();
			//_StdIn.putText(">");
			//alert(keyToUse);
			//alert(args.toString().length);
			//alert(_FileSize);
			if(args.length === 0 || args.length > _FileSize)
			{
				_StdIn.putText("File Creation Failed, Name Too Long Or Short.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			else if(args.indexOf("~") !== -1) //check if EOF is in the filename (this is the only invalid filename for CATos. Dat freedom.)
			{
				_StdIn.putText("File Creation Failed, Invalid Character in Filename.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			else if(args.length === _FileSize)
			{
				var file = "1---" + args;
				_HardDrive.disk.setItem(keyToUse, file);
				_StdIn.putText("File Created.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			else if(args.length < _FileSize)
			{
				var file = "1---" + args + "~";
				_HardDrive.disk.setItem(keyToUse, file);
				_StdIn.putText("File Created.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			//alert(_HardDrive.disk.getItem(keyToUse));
		}
	}
};

DiskRead = function(args)
{
	//alert(args.length);
	var args = args.toString();
	//alert(args.length);
	if(formatFlag === 0) //check if the storage has been formatted
	{
		_StdIn.putText("File Read Failed, Disk not Formatted.");
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	else
	{
		var currentKey = "0,0,1"; //start with the first key, looking at the inUse byte.
		
		var inUseCheck = _HardDrive.disk.getItem(currentKey);
		var keyToUse = null;
		//alert(inUseCheck);
		
		while(currentKey !== "0,0,0") //check all possible file locations to see if any are empty
		{
			if((parseInt(inUseCheck.substring(0,1)) === 1) && (inUseCheck.substring(_FileDenote,inUseCheck.length-1)))//check the inUse byte
			{
				keyToUse = currentKey;
				break;
			}
			currentKey = getNextFileKey(currentKey);		
			inUseCheck = _HardDrive.disk.getItem(currentKey);
		}

		if(keyToUse === null)
		{
			_StdIn.putText("File Read Failed, Disk Not Found.");
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
		else
		{
			var rawContent = _HardDrive.disk.getItem(keyToUse);
			_StdIn.putText("File Content:");
			_StdIn.advanceLine();
			_StdIn.putText(content);
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
	}
};

DiskList = function()
{
	if(formatFlag === 0) //check if the storage has been formatted
	{
		_StdIn.putText("File List Failed, Disk not Formatted.");
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	else
	{
		var currentKey = "0,0,1"; //start with the first key, looking at the inUse byte.
		var inUseCheck = _HardDrive.disk.getItem(currentKey);
		var keyToUse = null;
		
		var filenameArray = []; //array to store the filenames
			
		while(currentKey !== "0,0,0")
		{
			if(parseInt(inUseCheck.substring(0,1)) === 1)
			{
				if(inUseCheck.substring(inUseCheck.length-1,inUseCheck.length) !== "~")
					filenameArray.push(inUseCheck.substring(_FileDenote,inUseCheck.length));
				else
					filenameArray.push(inUseCheck.substring(_FileDenote,inUseCheck.length-1));
			}
			currentKey = getNextFileKey(currentKey); //otherwise, get the next tsb			
			inUseCheck = _HardDrive.disk.getItem(currentKey);
		}
		//alert(filenameArray.join(", "));
		if(filenameArray.length > 0)
		{
			_StdIn.putText("Current Files on Disk:");
			_StdIn.advanceLine();
			_StdIn.putText(">");
			_StdIn.putText(filenameArray.join(", "));
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
		else
		{
			_StdIn.putText("There are currently no Files on Disk.");
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
	}
}

function getNextFileKey(key)
{
	var currentKey = key;
	if(parseInt(currentKey.substring(4,5)) < 7)
		var currentKey = key.substring(0,4) + (parseInt(key.substring(4,5)) + 1).toString();
	else if(parseInt(currentKey.substring(4,5)) === 7)
		var currentKey = key.substring(0,2) + (parseInt(key.substring(2,3)) + 1).toString() + ",0"; //admittedly messy, but more or less rebuilds the string based on the necessary changes
	if(parseInt(currentKey.substring(2,3)) > 7)
		var currentKey = "0,0,0";
	return currentKey;
}