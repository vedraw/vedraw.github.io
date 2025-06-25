# Concurrency in Golang: 3 Ways

Go makes concurrent programming simple, powerful, and efficient. Here are three main ways to handle concurrency in Go:

---

## 1. Goroutines

Goroutines are lightweight threads managed by the Go runtime. You start one using the `go` keyword:

```go
package main

import (
	"fmt"
	"time"
)

func sayHello() {
	fmt.Println("Hello from goroutine!")
}

func main() {
	go sayHello()
	time.Sleep(1 * time.Second)
	fmt.Println("Main function done.")
}
```

---

## 2. Channels

Channels allow goroutines to communicate safely:

```go
package main

import "fmt"

func sum(a, b int, ch chan int) {
	ch <- a + b
}

func main() {
	ch := make(chan int)
	go sum(3, 4, ch)
	result := <-ch
	fmt.Println("Sum:", result)
}
```

---

## 3. WaitGroups

Use `sync.WaitGroup` to wait for multiple goroutines to complete:

```go
package main

import (
	"fmt"
	"sync"
)

func worker(id int, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Printf("Worker %d starting\n", id)
	fmt.Printf("Worker %d done\n", id)
}

func main() {
	var wg sync.WaitGroup

	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go worker(i, &wg)
	}

	wg.Wait()
	fmt.Println("All workers done")
}
```

---

## Summary

| Method        | Use Case                                   | Pros                          |
|---------------|--------------------------------------------|-------------------------------|
| `goroutines`  | Basic concurrent tasks                     | Simple, lightweight           |
| `channels`    | Communicate between goroutines             | Type-safe, coordinated        |
| `WaitGroup`   | Wait for multiple tasks to finish          | Clean synchronization         |

---

[← Back to Home](../index.html)
