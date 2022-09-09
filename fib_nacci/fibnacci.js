function fib() {
	var n = 0;

	function nacci() {
		n++;
		console.log(fibbonacci(n));
	}

	function fibbonacci(num) {
		if (num <= 0) {
			return 0;
		} else if (num <= 2) {
			return 1;
		}

		return fibbonacci(num - 1) + fibbonacci(num - 2);
	}

	return nacci;
}

var fibCounter = fib();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();
fibCounter();