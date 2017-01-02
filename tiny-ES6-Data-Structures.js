/*
    Hi, This is a tiny simple Data Structure implemented by JavaScript using ECMAScript 2015 (aka ES6).

    During the implementaion, I used ES6 new features as many as I could.

    The main new features I've used are:
        class
        Proxy and Refect APIs
        generator

    The Data Structures are:
        ArrayList
        LinkedList
        Queue
        Stack
        BinaryTreeNode

    (ES6 already has awesome built-in Data Structures for Set and Map, so there's no need for me to implement
    a HashMap or something similar.)

    Ok, let's go!
*/

/*
    **
   ***
    **
    **
    **
   **** ArrayList !
*//*
    (This is a Java-like ArrayList class, offering similar API as ArrayList in Java)

    ArrayList offers random access of the array -> `get` and `set` methods
    Manipulate the data -> `append`, `add`, `remove` methods

    More importantly, we need to have two states:
        `array` -> hold the data in the ArrayList
        `length` -> get the `size` of the ArrayList in O(1) time
*/
class ArrayList {
    constructor() {
        this.array = []
        this.length = this.array.length

        /* Bind the methods */
        this.size = this.size.bind(this)
        this.append = this.append.bind(this)
        this.get = this.get.bind(this)
        this.set = this.set.bind(this)
        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)

        /*
            Since this is my self-implemented ArrayList data structure,
            I do not want to harness the built-in array method in JavaScript,
            nor I do not want to expose the `array` or `length` to the user,
            so I'm using the Proxy below to hide the `array` and `length` from user,
            the only way to access the `length` is to call the size() method,
            and the only way to access the data of the ArrayList is to call `get`, `set` methods, etc
        */
        return new Proxy(this, {
            /*
                Using `has` trap to hide the properties from user
            */
            has(trapTarget, key) {
                if (key === 'array' || key === 'length' || key === 'checkValidIndex') {
                    return false
                } else {
                    return Reflect.has(trapTarget, key)
                }
            },
            /*
                Using `get` trap to prevent user access of certain keys
            */
            get(trapTarget, key, receiver) {
                if (key === 'array' || key === 'length' || key === 'checkValidIndex') {
                    throw new Error(`${key} key is not accessible!`)
                } else {
                    return Reflect.get(trapTarget, key, receiver)
                }
            },
            /*
                Using `ownKeys` trap to hide keys from the internal [[OwnPropertyKeys]] method
            */
            ownKeys(trapTarget) {
                return Reflect.ownKeys(trapTarget).filter( key => (key !== 'array' && key !== 'length' && key !== 'checkValidIndex'))
            }
        })
        /*
            The `return` statement above returned a brand new Proxy.
            Making the `array` and `length` property and the `checkValidIndex` method
            invisible from user,
            so these are technically `PRIVATE` members.
        */
    }

    /*
        Making `ArrayList` an iterable, using the well-known Symbol: `Symbol.iterator`
    */
    *[Symbol.iterator]() {
        let i = 0
        while (i < this.size()) {
            yield this.get(i)
            i++
        }
    }

    toArray() {
        /*
            Since `ArrayList` is an iterable, so we can use `Array.from` method
            ( which works perfectly on iterables )
            to convert the ArrayList to an array
        */
        return Array.from(this)
    }

    /*
        The `private` member method for checking whether the given index is out of bound
    */
    checkValidIndex(id) {
        if (id < 0 || id >= this.size()) {
            throw new Error(`Index out of bound! At index: ${id}`)
        }
    }

    size() {
        /* Simply return the length */
        return this.length
    }

    /*
        Append the data to the end of the array
    */
    append(data) {
        this.array[this.length] = data
        this.length++
    }

    /*
        We need to do `checkValidIndex` in these four methods since they all have an
        argument of `index` (or id)
    */
    get(id) {
        this.checkValidIndex(id)
        return this.array[id]
    }

    set(id, data) {
        this.checkValidIndex(id)
        this.array[id] = data
    }

    remove(id) {
        this.checkValidIndex(id)

        let i = id + 1

        /* Shift all the data after index `id` one step foward */
        while (i < this.length) {
            this.array[i - 1] = this.array[i]
            i++
        }
        /* Shrink the length by one*/
        this.length--
    }

    add(id, data) {
        this.checkValidIndex(id)

        this.length++
        let i = this.length - 1

        /* Shift all the data after index `id` one step backward */
        while (i >= id + 1) {
            this.array[i] = this.array[i - 1]
            i--
        }
        this.array[id] = data
    }
}
/*
    End of ArrayList...
*/



/*
     *****
    **  **
       **
      **
     **
    ****** LinkedList !
*//*
    Typically, a Linked List only and always holds the `head` node,
    We don't know its size ( or length ).
*/
/*
    The `head` property in a LinkedList, is a `ListNode`
    A List Node contains a `data` property, and a `next` pointer, pointing to the node next to itself.
*/
class ListNode {
    constructor(data) {
        this.data = data
        this.next = null
    }
}

class LinkedList {
    /*
        construct the LinkedList with 0 or more arguments.
    */
    constructor(...args) {
        if (args.length === 0) {
            this.head = null
            return
        }

        /*
            If args.length is > 0, we initialize the LinkedList with all the arguments as its node data.
        */
        this.head = new ListNode(args[0])

        let pointer = this.head,
            i = 1

        while (i < args.length) {
            let nextNode = new ListNode(args[i])
            pointer.next = nextNode
            pointer = nextNode
            i++
        }
    }

    /* Like ArrayList, making `ListNode` an iterable */
    *[Symbol.iterator]() {
        let pointer = this.head
        while (pointer) {
            yield pointer
            pointer = pointer.next
        }
    }

    toArray() {
        /*
            The same as ArrayList, we can use `Array.from` method to convert the
            LinkedList to an array, notice that `Array.from` method's second argument is a callback function.
        */
        return Array.from(this, node => node.data)
    }

    find(position) {
        /*
            Since LinkedList class only holds the `head` node,
            so the only way for finding a node at a specific `position`
            is to go through it.
        */
        if (position < 0) {
            return null
        }

        let iterator = this[Symbol.iterator](),
            i = 0,
            current = iterator.next()

        while (!current.done) {
            if (i === position) {
                return current.value
            } else {
                current = iterator.next()
            }
            i++
        }
        return null
    }

    /*
        Add after a position
    */
    insertAfter(position, data) {
        /*
            `position === -1` means we are adding the node before the head,
            hence, our `head` should be changed
        */
        if (position === -1) {
            let newNode = new ListNode(data)
            newNode.next = this.head
            this.head = newNode
            return
        }

        let currentNode = this.find(position)

        if (currentNode) {
            let newNode = new ListNode(data)
            newNode.next = currentNode.next
            currentNode.next = newNode
        } else {
            throw new Error(`Cannot insert at position ${position + 1}: unreachable position!`)
        }
    }

    /*
        Insert a node at head
    */
    insertAtHead(data) {
        this.insertAfter(-1, data)
    }

    /*
        Delete a node after `position`, this is pretty simple to achieve,
        if we want to delete a node `AT` a position, we need to keep track of the node preceding to it.
    */
    deleteAfter(position) {
        if (position === -1) {
            this.head = this.head.next
            return
        }

        let currentNode = this.find(position)
        if (currentNode && currentNode.next) {
            currentNode.next = currentNode.next.next
        } else if (currentNode && !currentNode.next) {
            /*
                if currentNode.next is `null`, we do nothing.
            */
            return
        } else {
            throw new Error(`Cannot delete at position ${position + 1}: unreachable position!`)
        }
    }

    deleteAtHead() {
        this.deleteAfter(-1)
    }
}
/*
    End of LinkedList...
*/



/*
     *****
    **   **
         **
        **
         **
    **   **
     *****  Stack !
*//*
    A Stack is a First-In-Last-Out (aka FILO) Data Structure, but I can
    simply extends `LinkedList` to implement `Stack`,
    making use of the LinkedList `insertAtHead` and `deleteAtHead` method,

    Always manipulate the data in one end (at `head` in this example ) !
*/
class Stack extends LinkedList {
    constructor() {
        super()
    }

    /* Push the data into the stack */
    push(data) {
        this.insertAtHead(data)
    }

    /* Have a look at the data on top of the stack */
    peek() {
        if (this.head) {
            return this.head.data
        } else {
            return null
        }
    }

    /* Pop return the poped data */
    pop() {
        let toBeReturned = this.peek()
        this.deleteAtHead()
        return toBeReturned
    }
}
/*
    End of Stack...
*/



/*
       ***
      * **
     *  **
    *   **
    *******
        **  Queue !
*//*
    Queue is a First-In-First-Out (aka FIFO) Data Structure.
    Queue can be implemented by extending the `ArrayList`.
    (It can also be implemented by a `Doubly-Linked-List`)

    Base on the FIFO nature, Queue has two operations:
        `enqueue` -> put data into the Queue
        `dequeue` -> get data from the Queue

    Typically, if a Queue stores the data in a linear Data Structure (as it is in this example),
    we do the `enqueue` operation at one end, and do the `dequeue` operation at another
*/
class Queue extends ArrayList {
    constructor() {
        super()
    }
    /* Append data to the end */
    enqueue(data) {
        this.append(data)
    }

    /* Get data from the start */
    dequeue(data) {
        if (this.size() === 0) {
            return null
        } else {
            let dequeuedData = this.get(0)
            this.remove(0)
            return dequeuedData
        }
    }

    /* Just peek what's at the front of the queue */
    peek() {
        if (this.size() > 0) {
            return this.get(0)
        } else {
            return null
        }
    }
}
/*
    End of Queue...
*/



/*
    **
    *******
    **
    *****
         *
         *
    *****  BinaryTreeNode !
*//*
    A Binary Tree Node contains three properties:
        data -> the data the node stores
        left -> the pointer to the left node
        right -> the pointer to the right node
*/
class BinaryTreeNode {
    constructor(_data = 0) {
        this.data = _data
        this.left = null
        this.right = null
    }
}
/*
    This BinaryTree class contains two very simple tree traversal algorithms using generator:
        `preoder` and `inorder`
*/
class BinaryTree {
    /*
        Preorder alogrithm:
            First visit the current node,
            then visit the current node's children.
            (The order of visiting children nodes does not matter)
            (If it is a BinaryTree as this example shows, first visit left child or right child
            are both correct `preorder` alogrithm )
    */
    static *preorder(node) {
        if (node === null) {
            return
        }
        if ( !(node instanceof BinaryTreeNode) ) {
            throw Error(`The node must be a BinaryTreeNode instance!`)
        }
        yield node.data
        yield *this.preorder(node.left)
        yield *this.preorder(node.right)
    }

    /*
        Inorder alogrithm normally refers to BinaryTree:
            First visit current node's left child,
            then visit current node,
            then visit current node's right child.
    */
    static *inorder(node) {
        if (node === null) {
            return
        }
        if ( !(node instanceof BinaryTreeNode) ) {
            throw Error(`The node must be a BinaryTreeNode instance!`)
        }
        yield *this.inorder(node.left)
        yield node.data
        yield *this.inorder(node.right)
    }
}

/*
        ******  *       *  ****
       *       * *     *  *    *
      ******  *   *   *  *     *
     *       *     * *  *     *
    ******  *       *  ******
*/



/*
    TESTS
*//*
    Just use the most naive way to test as the first day I learn JS...
*/
function test() {

    console.log(`Test begins!
    `)
    console.log(`Test for ArrayList
    `)
    console.log(`   Create a new ArrayList instance and append 1,2,3,4,5,6 to it.`)
    let a = new ArrayList()
    a.append(1)
    a.append(2)
    a.append(3)
    a.append(4)
    a.append(5)
    a.append(6)
    console.log(`   The size of the array now is ${a.size()}`)

    console.log(`   Change data at index 2 to 100, add data 99 at index 4`)
    a.set(2, 100)
    a.add(4, 99)
    console.log(`   The ArrayList now become: [${a.toArray()}]`)
    a.remove(3)
    console.log(`   Remove data at index 3, now the ArrayList is [${a.toArray()}], the size becomes ${a.size()}
    `)


    console.log(`Test for LinkedList
    `)
    let l = new LinkedList(34,35,36)
    console.log(`   Create a new LinkedList with data 34, 35, 36 in a row (34 is the head)`)
    console.log(`   Insert a node after position 1 with data -999`)
    console.log(`   Then, delete a node after position 2`)
    l.insertAfter(1, -999)
    l.deleteAfter(2)
    console.log(`   The linked list now become [${l.toArray()}]
    `)

    console.log(`Test for Stack
    `)
    console.log(`   Create a Stack instance and push 77, 88, 99 to it one by one`)
    let s = new Stack()
    s.push(77)
    s.push(88)
    s.push(99)
    console.log(`   Make a pop() operation`)
    s.pop()
    console.log(`   Peek the top of the stack, it should be 88: ${s.peek()}
    `)

    console.log(`Test for Queue
    `)
    console.log(`   Create a Queue instance and enqueue 10, 20 and 30`)
    let q = new Queue()
    q.enqueue(10)
    q.enqueue(20)
    q.enqueue(30)
    console.log(`   Make a dequeue operation and the result should be 10: ${q.dequeue()}`)
    console.log(`   Peek the queue, and it should be 20: ${q.peek()}
    `)

    console.log(`Test for Binary Tree
    `)
    let root = new BinaryTreeNode(10)
    let left = new BinaryTreeNode(20)
    let right = new BinaryTreeNode(30)
    let leftLeft = new BinaryTreeNode(40)
    let rightLeft = new BinaryTreeNode(50)
    let rightRight = new BinaryTreeNode(60)
    right.left = rightLeft
    right.right = rightRight
    left.left =leftLeft
    root.left = left
    root.right = right
    console.log(`Constructed a Binary Tree like this:
            10
           /   \\
          20   30
          /    / \\
         40   50 60
    `)
    let inorderItr = BinaryTree.inorder(root),
        inorderResult = [],
        preorderItr = BinaryTree.preorder(root),
        preorderResult = []

    while (true) {
        let thisIterarion = inorderItr.next()
        if (thisIterarion.done) {
            break
        } else {
            inorderResult.push(thisIterarion.value)
        }
    }
    console.log(`   Do an inorder traverse to this tree, the result is: [${inorderResult}]`)
    while (true) {
        let thisIterarion = preorderItr.next()
        if (thisIterarion.done) {
            break
        } else {
            preorderResult.push(thisIterarion.value)
        }
    }
    console.log(`   Do an preorder traverse to this tree, the result is: [${preorderResult}]
    `)

    console.log(`The End of the tests!`)
}

/*
    Just call the test function!
*/
test()
