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
		mainMemoryFill();
		cpuMemoryFill();
    };
	
	this.nextOp = function(){
		return _Memory.mainMemory[this.PC + _Memory.rangeLow];  //more future-proofing
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



function cpuMemoryReset()
{
	Cpu.PC = 0;
	Cpu.Acc = 0;
	Cpu.Xreg = 0;
	Cpu.Yreg = 0;
	Cpu.Zflag = 0;
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