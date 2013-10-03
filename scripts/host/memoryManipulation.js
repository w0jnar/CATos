/* ------------  
   CPU.js

   Requires global.js.
   
   Designed to handle memory manipulations in terms of index.html
   ------------ */

function memoryReset(){
	_PC = 0;
	_ACC = 0;
	_XReg = 0;
	_YReg = 0;
	_ZFlag = 0;
}

function memoryCurrent(){
	_PC = Cpu.PC;
	_ACC = Cpu.Acc;
	_XReg = Cpu.Xreg;
	_YReg = Cpu.Yreg;
	_ZFlag = Cpu.Zflag;
}

function memoryFill(){
	var divPCFill = document.getElementById("divPC");
	divPCFill.innerText = divPCFill.textContent = _PC;
	var divACCFill = document.getElementById("divACC");
	divACCFill.innerText = divACCFill.textContent = _ACC;
	var divXRegFill = document.getElementById("divXReg");
	divXRegFill.innerText = divXRegFill.textContent = _XReg;
	var divYRegFill = document.getElementById("divYReg");
	divYRegFill.innerText = divYRegFill.textContent = _YReg;
	var divZFlagFill = document.getElementById("divZFlag");
	divZFlagFill.innerText = divZFlagFill.textContent = _ZFlag;   //admittedly, setting all of this to zero with this method seems pointless, though it is for future efforts.
}