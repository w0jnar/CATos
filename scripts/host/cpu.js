/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
    };
    
    this.cycle = function() {
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
		
		this.execute(this.nextOp());
		// mainMemoryFill();
		// cpuMemoryFill();
    };
	
	this.nextOp = function(){
		return _Memory.mainMemory[this.PC];  //more future-proofing
	}
//http://labouseur.com/courses/os/instructionset.pdf	
	this.execute = function(opcode){
//		_StdIn.putText(opcode); //test
		switch(opcode)
		{
		case "A9": 	//
			loadAccConst(); 
			break;
		case "AD": 	//
			loadAccMem();
			break;
		case "8D":	//
			storeAccMem();
			break;
		case "6D":	//
			addWithCarry();	
			break;
		case "A2":	//
			loadXRegConst();
			break;
		case "AE":  //
			loadXRegMem();
			break;
		case "A0":	//
			loadYRegConst();
			break;
		case "AC":  //
			loadYRegMem();
			break;
		case "EA":  //
			noOp();
			break;
		case "00":  //
			systemBreak();
			break;
		case "EC":  //
			compareMemXReg();
			break;
		case "D0":  //
			branchXBytes();	
			break;
		case "EE":  //
			incValueByte();	
			break;
		case "FF": 	//
			sysCall();
			break;
		default:
			systemBreak();	
			break;
		}
	}	
}

// A9
function loadAccConst()  //"Load the accumulator with a constant"
{
	var nextAdd = nextBytes();
	_CPU.Acc = parseInt(nextAdd,16);
	_CPU.PC++;
}

// AD
function loadAccMem()  //"Load the accumulator from memory"
{
	var hexLoc = next2Bytes(); //pulls the next two bytes and returns a single hex address in correct order.
	var decLoc = hexToDec(hexLoc,_Memory.rangeLow);
	if(decLoc <= _Memory.rangeHigh && decLoc >= _Memory.rangeLow)
	{
		_CPU.Acc = parseInt(_Memory.mainMemory[decLoc]);
	}
	else  //needs to be edited, but figured as current there is "only" 1 block of memory, I could move on for now.
	{
		hostLog("Error, Memory Fault, check PC", "CPU");
		cpuWrapUp();
		_CPU.isExecuting = false;
	}
	_CPU.PC++;
}

// 8D
function storeAccMem()  //"Store the accumulator in memory"
{
	var hexLoc = next2Bytes(); //pulls the next two bytes and returns a single hex address in correct order.
	var decLoc = hexToDec(hexLoc,_Memory.rangeLow); //hex to dec
	if(decLoc <= _Memory.rangeHigh && decLoc >= _Memory.rangeLow)
	{
		var accVal = _CPU.Acc.toString(16).toUpperCase();
		if( accVal.length === 1) //issues of byte only being returned, not bytes
		{
			accVal = "0" + accVal;
		}
		_Memory.mainMemory[decLoc] = accVal;
		
	}
	else
	{
		hostLog("Error, Memory Fault, check PC", "CPU");
		cpuWrapUp();
		_CPU.isExecuting = false;
	}
	_CPU.PC++;
}

// 6D
function addWithCarry()  //"Add with carry"
{
	var hexLoc = next2Bytes(); //pulls the next two bytes and returns a single hex address in correct order.
	var decLoc = hexToDec(hexLoc,_Memory.rangeLow); //hex to dec
	if(decLoc <= _Memory.rangeHigh && decLoc >= _Memory.rangeLow)
	{
		_CPU.Acc += parseInt(_Memory.mainMemory[decLoc], 16);
	}
	else
	{
		hostLog("Error, Memory Fault, check PC", "CPU");
		cpuWrapUp();
		_CPU.isExecuting = false;
	}
	_CPU.PC++;
}

// A2
function loadXRegConst()  //"Load the X register with a constant"
{
	var hexLoc = nextBytes(); //next, then parse, then store
	_CPU.Xreg = parseInt(hexLoc,16);
	_CPU.PC++;
}

// AE
function loadXRegMem()  //"Load the X register from memory"
{
	var hexLoc = next2Bytes(); //pulls the next two bytes and returns a single hex address in correct order.
	var decLoc = hexToDec(hexLoc,_Memory.rangeLow); //hex to dec
	if(decLoc <= _Memory.rangeHigh && decLoc >= _Memory.rangeLow)
	{
		_CPU.Xreg = parseInt(_Memory.mainMemory[decLoc],16);
		
	}
	else
	{
		hostLog("Error, Memory Fault, check PC", "CPU");
		cpuWrapUp();
		_CPU.isExecuting = false;
	}
	_CPU.PC++;
}

// A0
function loadYRegConst()  //"Load the Y register with a constant"
{
	var hexLoc = nextBytes(); //next, then parse, then store
	_CPU.Yreg = hexLoc;
	_CPU.PC++;
}

// AC
function loadYRegMem()  //"Load the Y register from memory"
{
	var hexLoc = next2Bytes(); //pulls the next two bytes and returns a single hex address in correct order.
	var decLoc = hexToDec(hexLoc,_Memory.rangeLow); //hex to dec
	if(decLoc <= _Memory.rangeHigh && decLoc >= _Memory.rangeLow)
	{
		_CPU.Yreg = parseInt(_Memory.mainMemory[decLoc],16);
		
	}
	else
	{
		hostLog("Error, Memory Fault, check PC", "CPU");
		cpuWrapUp();
		_CPU.isExecuting = false;
	}
	_CPU.PC++;
}

// EA
function noOp()  //"No Operation"
{
	_CPU.PC++;
}

// 00
function systemBreak()  //"Break (which is really a system call)"
{
//	var pcb =  _KernelReadyQueue.q[_CurrentPCB];
	hostLog("Execution Terminated", "CPU");
	cpuWrapUp();
	if(_KernelReadyQueue.isEmpty() || _RunAllFlag !== 1)
	{
		_CPU.isExecuting = false;
		_RunAllFlag = 0;
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	else if(_RunAllFlag === 1 && !_KernelReadyQueue.isEmpty())
	{
		krnNextProcess();
	}
	else if(_RunAllFlag === 1)
	{
		_RunAllFlag = 0;
	}
}

// EC
function compareMemXReg()  //"Compare a byte in memory to the X reg -  Sets the Z (zero) flag if equal"
{
	var hexLoc = next2Bytes(); //pulls the next two bytes and returns a single hex address in correct order.
	var decLoc = hexToDec(hexLoc,_Memory.rangeLow); //hex to dec
	if(decLoc <= _Memory.rangeHigh && decLoc >= _Memory.rangeLow)
	{
		_CPU.Zflag = (parseInt(_Memory.mainMemory[decLoc]) === _CPU.Xreg) ? 1 : 0;
	}
	else
	{
		hostLog("Error, Memory Fault, check PC", "CPU");
		cpuWrapUp();
		_CPU.isExecuting = false;
	}
	_CPU.PC++;
}

// D0
function branchXBytes()  //"Branch X bytes if Z flag = 0"
{
	if(_CPU.Zflag === 0)
	{
		var branchLoc = parseInt(nextBytes(),16);  //get the location after the branch counting offset.
		_CPU.PC += branchLoc; //add it to the PC
		
		if(_CPU.PC > (_PartitionSize-1)) //check if it outside the range of the block. Admittedly, probably going to change the ranges to something else, but as it stood, they worked well in mainMemory seeing as they are the ranges.
		{
			_CPU.PC -= (_PartitionSize);
		}
		_CPU.PC++;
	}
	else
	{
		_CPU.PC += 2;
	}
}

// EE
function incValueByte()  //"Increment the value of a byte"
{
	var hexLoc = next2Bytes(); //pulls the next two bytes and returns a single hex address in correct order.
	var decLoc = hexToDec(hexLoc,_Memory.rangeLow); //hex to dec
	if(decLoc <= _Memory.rangeHigh && decLoc >= _Memory.rangeLow)
	{
		var decVal = parseInt(_Memory.mainMemory[decLoc],16);
		decVal++;
//		decLoc++; //there probably is a better/more streamline way to do this, but this was the first think that came to mind seeing as I was already converting to test bounds.
		var hexVal = decVal.toString(16).toUpperCase();
		if( hexVal.length === 1) //issues of byte only being returned, not bytes
		{
			hexVal = "0" + hexVal;
		}
		_Memory.mainMemory[decLoc] = hexVal;
		
	}
	else
	{
		hostLog("Error, Memory Fault, check PC", "CPU");
		cpuWrapUp();
		_CPU.isExecuting = false;
	}
	_CPU.PC++;
}

//FF
function sysCall()  //"System Call - #$01 in X reg = print the integer stored in the Y register. - #$02 in X reg = print the 00-terminated string stored at the address in the Y register."
{
	if(_CPU.Xreg === 1)  //"System Call - #$01 in X reg = print the integer stored in the Y register.
	{
		var yValue = parseInt(_CPU.Yreg).toString(); //get yValue to a string
		
		for( var i = 0; i < yValue.length; i++)
		{
			_StdIn.putText(yValue.charAt(i));  //prints y
		}
	}
	else if(_CPU.Xreg === 2)
	{
		var decLoc = hexToDec(_CPU.Yreg,_Memory.rangeLow); //decimal location
		var check = "00";									//comparison value
		var currentBytes = _Memory.mainMemory[decLoc];
		var keyCode = 0;
		var currentCharacter = "";
		
		while(currentBytes != check)
		{
			keyCode = parseInt(currentBytes, 16); 			   //int from bytes
			currentCharacter = String.fromCharCode(keyCode);   //"character" from int
			_StdIn.putText(currentCharacter);				   //print the character
			currentBytes = _Memory.mainMemory[++decLoc];
		}
	}
	_CPU.PC++;
}

function cpuMemoryReset()
{
	_CPU.PC = 0;
	_CPU.Acc = 0;
	_CPU.Xreg = 0;
	_CPU.Yreg = 0;
	_CPU.Zflag = 0;
}

function cpuMemoryFill() //for updating the current memory block on the client
{	
	var divPCFill = document.getElementById("divPC");
	divPCFill.innerText = divPCFill.textContent = toHexString(_CPU.PC);
	var divACCFill = document.getElementById("divACC");
	divACCFill.innerText = divACCFill.textContent = _CPU.Acc;
	var divXRegFill = document.getElementById("divXReg");
	divXRegFill.innerText = divXRegFill.textContent = _CPU.Xreg;
	var divYRegFill = document.getElementById("divYReg");
	divYRegFill.innerText = divYRegFill.textContent = _CPU.Yreg;
	var divZFlagFill = document.getElementById("divZFlag");
	divZFlagFill.innerText = divZFlagFill.textContent = _CPU.Zflag;   //admittedly, setting all of this to zero with this method seems pointless, though it is for future efforts.
}

function cpuWrapUp()
{
	_KernelReadyQueue.q[0].statusUp("terminated", _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
	_KernelReadyQueue.q[0].pcbMemoryFill(1);
	_KernelReadyQueue.dequeue();
	programCount--;
}