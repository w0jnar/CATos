/* ------------  
   memoryManipulation.js

   Requires global.js.
   
   Designed to handle memory manipulations in terms of index.html
   ------------ */

/* function memoryCurrent(){   Note:antiquated
	_PC = Cpu.PC;
	_ACC = Cpu.Acc;
	_XReg = Cpu.Xreg;
	_YReg = Cpu.Yreg;
	_ZFlag = Cpu.Zflag;
} */


function mainMemoryFill(){ //updates the memory block
	var fill = mainMemoryInitString();
	var programTA = document.getElementById("taMemory");
	programTA.value = fill;
}


function mainMemoryUpdate(args, loc){ //pass the string and eventually the block in memory. Was considering passing the PID, but seemed like it would not work as well if changed. Even then though, we will see with this solution.
//	args = args.replace(/\s+/g, ''); unnecessary due to eventual 'load' changes, though just in case thought I should keep it.
	var substringLower = 0;
	var incrementValue = ((loc-1) * _PartitionSize) //figures out what block it should be in
	for (var i=0 + incrementValue; i<(incrementValue) + args.length/2; i++)
	{ 
		if(args.substr(substringLower, 2) !== "  ") //Two characters at a time.
		{
			_Memory.mainMemory[i] = args.substr(substringLower, 2);
		}
		substringLower += 2;
	}
}

function mainMemoryRewrite(base, limit){ 
	for (var i=base; i<=limit; i++)
	{ 
		var memoryCell = "00";
		_Memory.mainMemory[i] = memoryCell;
	}
}	

function mainMemoryInitString()  //creates a string of the mainMemoroy array to be printed to the index. There are definitely better ways, but I would say this is probably the most unique way that does not seem asinine.
{
	var current = 0;
	var stringReturn;
//	hexString = current.toString(16);
//	current = parseInt(hexString, 16);
	var j = 0; //column count more or less
	var currentBlock = 1;
	for(var i = 0; i <= _TotalLines; i++)
	{
		if(i == 0)
		{
			stringReturn = "                     Memory                     \n";
		}
		else if((i === _LineBreak1) || (i === _LineBreak2) || (i === _LineBreak3))
		{
			stringReturn += "                    Program " + currentBlock + "                \n";
			currentBlock++;
		}
		else
		{
			stringReturn += " " + toHexString(j) + " | ";
			for(var cellCount = 0; cellCount < _MaxCellCount; cellCount++)   //realistically could have probably used j here or changed the variables, but for my own sake, this just helped me.
			{
				stringReturn += _Memory.mainMemory[j++] + " | ";
			}
			stringReturn += "|\n";
		}
	}
	return stringReturn;
}	

function memoryRanges(inProcess)  //modifies the memory ranges according the the pcb (done in the kernel).
{
	_Memory.rangeLow = inProcess.base;
	_Memory.rangeHigh = inProcess.limit;
}


function hexToDec(args, offset) //somewhat self explanatory. args is hex to change, offset accounts for memory block. 
{
	return parseInt(args,16) + offset;
}

function nextBytes()  //pulls the next byte from memory.
{	
	return _Memory.mainMemory[(++_CPU.PC + _Memory.rangeLow)];
}

function next2Bytes()  //pulls the next 2 byte from memory and makes them into a hex address.
{	
	var storeCheck1 = _Memory.mainMemory[(++_CPU.PC + _Memory.rangeLow)];
	var storeCheck2 = _Memory.mainMemory[(++_CPU.PC + _Memory.rangeLow)];
	var hexLoc = storeCheck2 + storeCheck1;
	return hexLoc;
}