/* ------------------------------
   mainMemory.js
   
   Prototype and Memory Creation for the OS
   ------------------------------ */


var mainMemory = new Array(768);
for (var i=0; i<mainMemory.length; i++)
{ 
	var memoryCell = "  ";
	mainMemory[i] = memoryCell;
}

function memInit(){
	for (var i=0; i<mainMemory.length; i++)
	{ 
		var memoryCell = "00";
		mainMemory[i] = memoryCell;
	}
}

function mainMemoryInitString()  //creates a string of the mainMemoroy array to be printed to the index. 
{
	var current = 0;
	var stringReturn;
//	hexString = current.toString(16);
//	current = parseInt(hexString, 16);
	var j = 0; //column count more or less
	var currentBlock = 1;
	for(var i = 0; i <= 99; i++)
	{
		if(i == 0)
		{
			stringReturn = "                     Memory                     \n";
		}
		else if((i === 1) || (i === 34) || (i === 67))
		{
			stringReturn += "                    Program " + currentBlock + "                \n";
			currentBlock++;
		}
		else
		{
			stringReturn += " " + toHexString(j) + " | ";
			for(var cellCount = 0; cellCount < 8; cellCount++)   //realistically could have probably used j here or changed the variables, but for my own sake, this just helped me.
			{
				stringReturn += mainMemory[j++] + " | ";
			}
			stringReturn += "\n";
		}
	}
	return stringReturn;
}	