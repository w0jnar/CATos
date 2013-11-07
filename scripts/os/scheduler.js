/* ------------------------------
   scheduler.js
   ------------------------------ */

scheduler = function()
{
	hostLog("Context Switch", "Scheduler");
	//alert("next");
	_ContextSwitch = 1;
	if(_KernelReadyQueue.getSize() > 1 && _KernelReadyQueue.q[0].state !== "terminated")
	{
		//alert("meow1");
		_KernelReadyQueue.q[0].statusUp("ready", _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
		_KernelReadyQueue.enqueue(_KernelReadyQueue.q[0]);
		_KernelReadyQueue.dequeue();
		var currentProcess = _KernelReadyQueue.q[0];
		_CPU.statusUp(currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
		_KernelReadyQueue.q[0].statusUp("running", currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
	}
	else if(_KernelReadyQueue.getSize() === 1 && _KernelReadyQueue.q[0].state !== "terminated")
	{
		//alert("meow2");
		_KernelReadyQueue.q[0].statusUp("ready", _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
		var currentProcess = _KernelReadyQueue.q[0];
		_CPU.statusUp(currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
		_KernelReadyQueue.q[0].statusUp("running", currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
	}
	else if(_KernelReadyQueue.getSize() > 1 && _KernelReadyQueue.q[0].state === "terminated")
	{
		//alert("meow3");
		_KernelReadyQueue.dequeue();
		var currentProcess = _KernelReadyQueue.q[0];
		_CPU.statusUp(currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
		_KernelReadyQueue.q[0].statusUp("running", currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
		programCount--;
	}
	else if(_KernelReadyQueue.getSize() === 1 && _KernelReadyQueue.q[0].state === "terminated")
	{
		//alert("meow4");
		_KernelReadyQueue.q[0].pcbMemoryFill(1);
		_KernelReadyQueue.dequeue();
		programCount--;
		_CPU.isExecuting = false;
		cpuMemoryReset();
		cpuMemoryFill();
		_RunAllFlag = 0;
		_ContextSwitch = 1;
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	if(!_KernelReadyQueue.isEmpty())
		memoryRanges(_KernelReadyQueue.q[0]);
} 