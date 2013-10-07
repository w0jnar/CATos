/* ------------  
   CPU.js

   Requires global.js.
   
   Designed to handle memory manipulations in terms of index.html
   ------------ */

function memoryReset(){
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

function memoryFill(){
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

function mainMemoryFill(){
	var fill = mainMemoryInitString();
	var programTA = document.getElementById("taMemory");
	programTA.value = fill;
}