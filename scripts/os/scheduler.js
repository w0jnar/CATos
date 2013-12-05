/* ------------------------------
   scheduler.js
   ------------------------------ */

scheduler = function()
{
	//hostLog("Context Switch", "Scheduler");
	//alert("next");
	if(_ContextSwitch > QUANTUM && scheduleAlgorithm === "rr")
	{
		if(_KernelReadyQueue.getSize() > 1 && _KernelReadyQueue.q[0].state !== "terminated")
		{
			//alert("meow1");
			_ContextSwitch = 1;
			var taLog = document.getElementById("taLog");
			taLog.value = "Context Switch Occurring\n" + taLog.value;
			_KernelReadyQueue.q[0].pcbMemoryFill(1);
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
			_ContextSwitch = 1;
			_KernelReadyQueue.q[0].pcbMemoryFill(1);
			_KernelReadyQueue.q[0].statusUp("ready", _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
			var currentProcess = _KernelReadyQueue.q[0];
			_CPU.statusUp(currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
			_KernelReadyQueue.q[0].statusUp("running", currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
		}
		else if(_KernelReadyQueue.getSize() > 1 && _KernelReadyQueue.q[0].state === "terminated")
		{
			//alert("meow3");
			_ContextSwitch = 1;
			var taLog = document.getElementById("taLog");
			taLog.value = "Context Switch Occurring\n" + taLog.value;
			_KernelReadyQueue.q[0].pcbMemoryFill(1);
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
	}
	else if(scheduleAlgorithm === "fcfs")
	{
		//_PreviousQuantum = QUANTUM;
		//QUANTUM = _FCFSQUANTUM;
		_ContextSwitch = 1;
		if(_KernelReadyQueue.q[0].state === "terminated" && _KernelReadyQueue.getSize() > 1)
		{
			var taLog = document.getElementById("taLog");
			taLog.value = "Context Switch Occurring\n" + taLog.value;
			_KernelReadyQueue.q[0].pcbMemoryFill(1);
			_KernelReadyQueue.dequeue();
			var currentProcess = _KernelReadyQueue.q[0];
			_CPU.statusUp(currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
			_KernelReadyQueue.q[0].statusUp("running", currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
			programCount--;
		}
		else if(_KernelReadyQueue.q[0].state === "terminated" && _KernelReadyQueue.getSize() === 1)
		{
			_KernelReadyQueue.q[0].pcbMemoryFill(1);
			_KernelReadyQueue.dequeue();
			programCount--;
			_CPU.isExecuting = false;
			cpuMemoryReset();
			cpuMemoryFill();
			_RunAllFlag = 0;
			_ContextSwitch = 1;
			QUANTUM = _PreviousQuantum;
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
	}
	else if(scheduleAlgorithm === "priority")
	{
		//_PreviousQuantum = QUANTUM;
		//QUANTUM = _FCFSQUANTUM;
		_ContextSwitch = 1;
		if(firstTime === 0)
		{
			prioritySort();
			firstTime = 1;
		}
		if(_KernelReadyQueue.q[0].state === "terminated" && _KernelReadyQueue.getSize() > 1)
		{
			var taLog = document.getElementById("taLog");
			taLog.value = "Context Switch Occurring\n" + taLog.value;
			_KernelReadyQueue.q[0].pcbMemoryFill(1);
			_KernelReadyQueue.dequeue();
			var currentProcess = _KernelReadyQueue.q[0];
			_CPU.statusUp(currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
			_KernelReadyQueue.q[0].statusUp("running", currentProcess.pc, currentProcess.acc, currentProcess.xReg, currentProcess.yReg, currentProcess.zFlag);
			programCount--;
		}
		else if(_KernelReadyQueue.q[0].state === "terminated" && _KernelReadyQueue.getSize() === 1)
		{
			_KernelReadyQueue.q[0].pcbMemoryFill(1);
			_KernelReadyQueue.dequeue();
			programCount--;
			_CPU.isExecuting = false;
			cpuMemoryReset();
			cpuMemoryFill();
			_RunAllFlag = 0;
			_ContextSwitch = 1;
			firstTime = 0;
			QUANTUM = _PreviousQuantum;
			_StdIn.advanceLine();
			_StdIn.putText(">");
		}
	}
	if(!_KernelReadyQueue.isEmpty())
			memoryRanges(_KernelReadyQueue.q[0]);
}

 function prioritySort()
 {
	function compare(a,b) {
		if (a.priority < b.priority)
			return -1;
		if (a.priority > b.priority)
			return 1;
		return 0;
	}
	_KernelReadyQueue.q.sort(compare);
 }