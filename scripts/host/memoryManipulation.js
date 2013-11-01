/* ------------  
   memoryManipulation.js

   Requires global.js.
   
   Designed to handle memory manipulations in terms of index.html
   ------------ */

function cpuMemoryReset(){
	Cpu.PC = 0;
	Cpu.Acc = 0;
	Cpu.Xreg = 0;
	Cpu.Yreg = 0;
	Cpu.Zflag = 0;
}

/* function memoryCurrent(){   Note:antiquated
	_PC = Cpu.PC;
	_ACC = Cpu.Acc;
	_XReg = Cpu.Xreg;
	_YReg = Cpu.Yreg;
	_ZFlag = Cpu.Zflag;
} */

function cpuMemoryFill(){
	var divPCFill = document.getElementById("divPC");
	divPCFill.innerText = divPCFill.textContent = Cpu.PC;
	var divACCFill = document.getElementById("divACC");
	divACCFill.innerText = divACCFill.textContent = Cpu.Acc;
	var divXRegFill = document.getElementById("divXReg");
	divXRegFill.innerText = divXRegFill.textContent = Cpu.Xreg;
	var divYRegFill = document.getElementById("divYReg");
	divYRegFill.innerText = divYRegFill.textContent = Cpu.Yreg;
	var divZFlagFill = document.getElementById("divZFlag");
	divZFlagFill.innerText = divZFlagFill.textContent = Cpu.Zflag;   //admittedly, setting all of this to zero with this method seems pointless, though it is for future efforts.
}

function mainMemoryUpdate(args, loc){
//	args = args.replace(/\s+/g, ''); unnecessary due to eventual 'load' changes, though just in case thought I should keep it.
	var substringLower = 0;
	var incrementValue = ((loc-1) * _PartitionSize)
	for (var i=0 + incrementValue; i<(incrementValue) + args.length/2; i++)
	{ 
		if(args.substr(substringLower, 2) !== "  ") //Two characters at a time.
		{
			_Memory.mainMemory[i] = args.substr(substringLower, 2);
		}
		substringLower += 2;
	}
}	
