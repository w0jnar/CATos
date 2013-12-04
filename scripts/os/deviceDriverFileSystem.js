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
		case "write":
			DiskWrite(args[1]);
			break;
		case "read":
			DiskRead(args[1]);
			break;
		case "delete":
			DiskDelete(args[1]);
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
	_ClearedValue = data;

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
		var args = args.join(" "); //necessary as otherwise treated as an array (it gets messy).
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
			else if(args.indexOf("~") !== -1 || args.indexOf(" ") !== -1) //check if EOF is in the filename (this is the only invalid filename for CATos. Dat freedom.)
			{
				_StdIn.putText("File Creation Failed, Invalid Character in Filename.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			else if(args.length === _FileSize)
			{
				var file = "1---" + args;
				//window.alert(file);
				_HardDrive.disk.setItem(keyToUse, file);
				_StdIn.putText("File Created.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			else if(args.length < _FileSize)
			{
				var file = "1---" + args + "~";
				var buffer = _MaxBytes - file.length;
				for(var i = 0; i < buffer; i++)
				{
					file += "-";
				}
				//window.alert(file);
				_HardDrive.disk.setItem(keyToUse, file);
				_StdIn.putText("File Created.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			//alert(_HardDrive.disk.getItem(keyToUse));
		}
	}
};

DiskWrite = function(args)
{
	//alert(args.length);
	var args = args.join(" ");
	//alert(args);
	//alert(args.length);
	if(formatFlag === 0) //check if the storage has been formatted
	{
		_StdIn.putText("File Write Failed, Disk not Formatted.");
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	else
	{
		var currentKey = "0,0,1"; //start with the first key, looking at the inUse byte.
		
		//var inUseCheck = _HardDrive.disk.getItem(currentKey);
		var keyToUse = null;
		var sizeToUse = args.toString().split(" ",1).toString().split("~",1).toString().length;

		//alert(sizeToUse);
		while(currentKey !== "0,0,0") //check all possible file locations to see if any are empty
		{
			var inUseCheck = _HardDrive.disk.getItem(currentKey);
			//alert(inUseCheck.substring(_FileDenote,inUseCheck.length).split("~",1).toString().trim());
			//alert(args.split(" ",1).toString().trim().length);
			if((parseInt(inUseCheck.substring(0,1)) === 1) && (inUseCheck.substring(_FileDenote,inUseCheck.length).split("~",1).toString().trim() === args.split(" ",1).toString().trim()))
			{
				keyToUse = currentKey;
				break;
			}
			currentKey = getNextFileKey(currentKey);		
			inUseCheck = _HardDrive.disk.getItem(currentKey);
		}

		if(keyToUse === null)
		{
			_StdIn.putText("File Write Failed, File Not Found.");
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
		else
		{
			var argsHolder = args.split(" "); //takes args and splits it into an array based on spaces.
			argsHolder.shift(); //removes the first element from the array, which will always be the name, and returns just the data.
			var dataToWrite = argsHolder.join(" ").toString(); //remakes it into a string.
			//alert(dataToWrite);
			dataToWrite += "~"; //appends the end of file character to the string.
			var dataToWriteCopy = dataToWrite;
			
			while(dataToWriteCopy.length >= _FileSize)
			{
				dataToWriteCopy = dataToWriteCopy.substring(_FileSize,dataToWriteCopy.length);
			}
			var buffer = _FileSize - dataToWriteCopy.length;
			for(var i = 0; i < buffer; i++)
			{
				dataToWrite += "-";
			}
			//alert(dataToWrite);
			var numOfPartitions = Math.ceil(dataToWrite.length / _FileSize);
			//alert(numOfPartitions);
			
			var currentDataKey = "1,0,0";
			var itemData = _HardDrive.disk.getItem(keyToUse); //preform the first write

			if(itemData.substring(1,_FileDenote) !== "---") //check if the file has be written to at least once
			{
				var dataKeyToUse = itemData.substring(1,_FileDenote);
				dataKeyToUse = dataKeyToUse.split("");
				dataKeyToUse = dataKeyToUse.join(",").toString();
			}
			else
			{
				var dataKeyToUse = dataKeyLoop(currentDataKey);
			}
			
			if(dataKeyToUse === null)
			{
				_StdIn.putText("File Write Failed, Disk Space Not Found.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			else
			{
				//alert(_HardDrive.disk.getItem(keyToUse));
				//var itemData = _HardDrive.disk.getItem(keyToUse);
				itemData = itemData.substring(0,1) + dataKeyToUse.replace(/[\,&]+/g, '') + itemData.substring(_FileDenote,_MaxBytes) //sets the file's data location
				_HardDrive.disk.setItem(keyToUse, itemData);
				//alert(_HardDrive.disk.getItem(keyToUse));
				//alert(dataKeyToUse);
				if(dataToWrite.length > _FileSize)
				{
					while(dataToWrite.length > 0)
					{
						if(dataToWrite.length > _FileSize) //not great, but it gets the job done
						{
							var writeValue = "1---" + dataToWrite.substring(0, _FileSize); //write it first to take the memory location
							_HardDrive.disk.setItem(dataKeyToUse, writeValue);
							var nextDataKeyToUse = dataKeyLoop("1,0,0");
							writeValue = "1" + nextDataKeyToUse.replace(/[\,&]+/g, '') + dataToWrite.substring(0, _FileSize);
							_HardDrive.disk.setItem(dataKeyToUse, writeValue);
							dataToWrite = dataToWrite.substring(_FileSize, dataToWrite.length); //get rid of the current first 60 characters
							//window.alert(_HardDrive.disk.getItem(dataKeyToUse));
							dataKeyToUse = nextDataKeyToUse;
						}
						else
						{
							var writeValue = "1---" + dataToWrite.substring(0, _FileSize); //write it first to take the memory location
							_HardDrive.disk.setItem(dataKeyToUse, writeValue);
							dataToWrite = dataToWrite.substring(_FileSize, dataToWrite.length); //just to end the loop
							//window.alert(_HardDrive.disk.getItem(dataKeyToUse));
						}
					}
				}
				else
				{
					var writeValue = "1---" + dataToWrite.substring(0, _FileSize);
					_HardDrive.disk.setItem(dataKeyToUse, writeValue);
					//window.alert(_HardDrive.disk.getItem(dataKeyToUse));
				}
				
				
				//keyToUse = dataKeyToUse; //set the key to use to be the first block of memory.
				//alert
				_StdIn.putText("Data Written.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			
		}
	}
};

DiskRead = function(args)
{
	//alert(args.length);
	var args = args.join(" ");
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
		
		//var inUseCheck = _HardDrive.disk.getItem(currentKey);
		var keyToUse = null;
		var sizeToUse = args.toString().split(" ",1).toString().split("~",1).toString().length;

		//alert(sizeToUse);
		while(currentKey !== "0,0,0") //check all possible file locations to see if any are empty
		{
			var inUseCheck = _HardDrive.disk.getItem(currentKey);
			if((parseInt(inUseCheck.substring(0,1)) === 1) && (inUseCheck.substring(_FileDenote,inUseCheck.length).split("~",1).toString().trim() === args.split(" ",1).toString().trim()))
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
			var filename = rawContent.toString().substring(_FileDenote,inUseCheck.length).split("~",1).toString();
			var dataLocation = rawContent.substring(1,_FileDenote);
			dataLocation = dataLocation.split("");
			dataLocation = dataLocation.join(",").toString();
			//alert(dataLocation);
			if(dataLocation === "-,-,-")
			{
				_StdIn.putText("File Not Written To.");
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
			else
			{
				var data = filePull(dataLocation);
				data = data.split("~",1).toString();
				//window.alert(data);
				_StdIn.putText("File Content of ");
				_StdIn.putText(filename);
				_StdIn.putText(":");
				_StdIn.advanceLine();
				_StdIn.putText(">");
				_StdIn.putText(data);
				_StdIn.advanceLine();
				_StdIn.putText(">");
			}
		}
	}
};


DiskDelete = function(args)
{
	if(formatFlag === 0) //check if the storage has been formatted
	{
		_StdIn.putText("File Delete Failed, Disk not Formatted.");
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	else
	{
		var currentKey = "0,0,1"; //start with the first key, looking at the inUse byte.
		
		//var inUseCheck = _HardDrive.disk.getItem(currentKey);
		var keyToUse = null;
		var sizeToUse = args.toString().split(" ",1).toString().split("~",1).toString().length;

		//alert(sizeToUse);
		while(currentKey !== "0,0,0") //check all possible file locations to see if any are empty
		{
			var inUseCheck = _HardDrive.disk.getItem(currentKey);
			//alert(inUseCheck.substring(_FileDenote,inUseCheck.length).split("~",1).toString().trim());
			//alert(args.split(" ",1).toString().trim().length);
			if((parseInt(inUseCheck.substring(0,1)) === 1) && (inUseCheck.substring(_FileDenote,inUseCheck.length).split("~",1).toString().trim() === args.toString().split(" ",1).toString().trim()))
			{
				keyToUse = currentKey;
				break;
			}
			currentKey = getNextFileKey(currentKey);		
			inUseCheck = _HardDrive.disk.getItem(currentKey);
		}

		if(keyToUse === null)
		{
			_StdIn.putText("File Deletion Failed, File Not Found.");
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
		else
		{
			var fileToDelete = _HardDrive.disk.getItem(keyToUse); //delete the file
			var dataKey = fileToDelete.substring(1,_FileDenote);
			_HardDrive.disk.setItem(keyToUse,_ClearedValue);
			if(dataKey !== "---") //check if it was written to and if so, delete.
			{
				deleteData(dataKey);
			}
			_StdIn.putText("File Deletion Successful.");
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
				var filename = inUseCheck.substring(_FileDenote,_FileSize).split("~",1);
				filenameArray.push(filename);
			}
			currentKey = getNextFileKey(currentKey); //otherwise, get the next tsb			
			inUseCheck = _HardDrive.disk.getItem(currentKey);
		}
		//alert(filenameArray.join(", "));
		if(filenameArray.length > 0)
		{
			_StdIn.putText("Current Files on Disk:");
			for(var i = 0; i < filenameArray.length; i++)
			{
				_StdIn.advanceLine();
				_StdIn.putText(">");
				_StdIn.putText(filenameArray[i].toString());
			}
		}
		else
		{
			_StdIn.putText("There are currently no Files on Disk.");
		}
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
}

function getNextFileKey(key) //removed magic number, but at what cost(interrobang)
{
	var currentKey = key;
	if(parseInt(currentKey.substring(_BlockRangeLower,_BlockRangeUpper)) < _MaxBlocks - 1)
	{
		currentKey = key.substring(0,_BlockRangeLower) + (parseInt(key.substring(_BlockRangeLower,_BlockRangeUpper)) + 1).toString();
	}
	else if(parseInt(currentKey.substring(_BlockRangeLower,_BlockRangeUpper)) === _MaxBlocks - 1)
	{
		currentKey = key.substring(0,_SectorRangeLower) + (parseInt(key.substring(_SectorRangeLower,_SectorRangeUpper)) + 1).toString() + ",0"; //admittedly messy, but more or less rebuilds the string based on the necessary changes
	}
	if(parseInt(currentKey.substring(_SectorRangeLower,_SectorRangeUpper)) > _MaxSectors - 1)
	{
		currentKey = "0,0,0";
	}
	return currentKey;
}

function getNextDataKey(key) //starting key is "1,0,0"
{
	var currentKey = key;
	if(parseInt(currentKey.substring(_BlockRangeLower,_BlockRangeUpper)) < _MaxBlocks - 1) //Block
	{
		currentKey = currentKey.substring(0,_BlockRangeLower) + (parseInt(currentKey.substring(_BlockRangeLower,_BlockRangeUpper)) + 1).toString();
	}
	else if(parseInt(currentKey.substring(_BlockRangeLower,_BlockRangeUpper)) === _MaxBlocks - 1)
	{
		currentKey = currentKey.substring(0,_SectorRangeLower) + (parseInt(currentKey.substring(_SectorRangeLower,_SectorRangeUpper)) + 1).toString() + ",0"; //admittedly messy, but more or less rebuilds the string based on the necessary changes
	}

	if(parseInt(currentKey.substring(_SectorRangeLower,_SectorRangeUpper)) > _MaxSectors - 1) //Sector
	{
		currentKey = (parseInt(currentKey.substring(0,1)) + 1).toString() + ",0," + currentKey.substring(_BlockRangeLower,_BlockRangeUpper);
	}
	
	if(parseInt(currentKey.substring(0,1)) > _MaxTracks - 1) //Sector
	{
		currentKey = "0,0,0";
	}
	return currentKey;
}

function dataKeyLoop(currentDataKey)
{
	//var currentDataKey = getNextDataKey(currentDataKey);
	var inUseCheckData = _HardDrive.disk.getItem(currentDataKey);

	var fileKeyToUse = null;
	while(currentDataKey !== "0,0,0")
	{
		if(parseInt(inUseCheckData.substring(0,1)) === 0)
		{
			fileKeyToUse = currentDataKey;
			break;
		}
		var currentDataKey = getNextDataKey(currentDataKey);
		inUseCheckData = _HardDrive.disk.getItem(currentDataKey);
		//alert(currentDataKey);
	}
	return fileKeyToUse;
}

function filePull(currentDataKey)
{
	var inUseCheckData = _HardDrive.disk.getItem(currentDataKey);
	var outStr = inUseCheckData.substring(_FileDenote,inUseCheckData.length);
	while((inUseCheckData.substring(1,_FileDenote) !== "---") || (parseInt(inUseCheckData.substring(0,1)) !== 1))
	{
		var dataKeyToUse = inUseCheckData.substring(1,_FileDenote);
		dataKeyToUse = dataKeyToUse.split("");
		dataKeyToUse = dataKeyToUse.join(",").toString();
		inUseCheckData = _HardDrive.disk.getItem(dataKeyToUse);
		outStr += inUseCheckData.substring(_FileDenote,inUseCheckData.length);
	}
	//window.alert(outStr);
	return outStr;
}

function deleteData(currentDataKey)
{
	var dataKeyToUse = currentDataKey.split("");
	dataKeyToUse = dataKeyToUse.join(",").toString();
	
	var inUseCheckData = _HardDrive.disk.getItem(dataKeyToUse);
	//var nextData = inUseCheckData.substring(1,_FileDenote);

	_HardDrive.disk.setItem(dataKeyToUse,_ClearedValue);
	
	while((inUseCheckData.substring(1,_FileDenote) !== "---") || (parseInt(inUseCheckData.substring(0,1)) === 1))
	{
		var dataKeyToDelete = inUseCheckData.substring(1,_FileDenote);
		dataKeyToDelete = dataKeyToDelete.split("");
		dataKeyToDelete = dataKeyToDelete.join(",").toString();
		inUseCheckData = _HardDrive.disk.getItem(dataKeyToDelete);
		_HardDrive.disk.setItem(dataKeyToDelete,_ClearedValue);
		//alert(_HardDrive.disk.getItem(dataKeyToUse));
		if(inUseCheckData === null)
		{
			break;
		}
	}
	//alert(_HardDrive.disk.getItem(dataKeyToUse));
	//return outStr;
}