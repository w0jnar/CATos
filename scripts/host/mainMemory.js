/* ------------------------------
   mainMemory.js
   
   Prototype and Memory Creation for the OS
   ------------------------------ */

function MainMemory()
{
	this.mainMemory = new Array(3 * _PartitionSize);
	
	this.init = function() {
        for (var i=0; i<this.mainMemory.length; i++)
	{ 
		var memoryCell = "  ";
		this.mainMemory[i] = memoryCell;
	}
    };
	
	this.rangeLow = 0;    //default values
	this.rangeHigh = _PartitionSize - 1;
	
	this.mainMemoryInit = function() {
	for (var i=0; i<_Memory.mainMemory.length; i++) //just for when the os starts. might be changed for individual sections of memory.
	{ 
		var memoryCell = "00";
		_Memory.mainMemory[i] = memoryCell;
	}
	}
}