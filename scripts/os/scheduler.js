/* ------------------------------
   scheduler.js
   ------------------------------ */

scheduler = function()
{
	hostLog("Context Switch", "Scheduler");
	_ContextSwitch = 1;
	_KernelReadyQueue.q[0].statusUp("ready", _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
	_KernelReadyQueue.enqueue(_KernelReadyQueue.q[0]);
	_KernelReadyQueue.dequeue();
	var currentProcess = _KernelReadyQueue.q[0];
	_CPU.statusUp(currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
	//_KernelReadyQueue.q[0].statusUp("ready", _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
	_KernelReadyQueue.q[0].statusUp("running", currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
} 