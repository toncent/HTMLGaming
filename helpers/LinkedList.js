/*Linked List for use in other Projects.
The idea is that the User does not have to deal with nodes outside of this class.
All getters return the content of the nodes instead of the nodes themselves
*/
function LinkedList(){
	this.head = null;
	this.tail = null;
	this.size = 0;
	this.get = function(idx){
		if(idx <= 0) return this.getFirst();
		if(idx >= this.size) return this.getLast();
		
		var current = this.head;
		for(var i=0;i<idx;i++){
			current = current.next;
		}
		return current.content;
	}

	this.getFirst = function(){
		return this.head.content;
	}

	this.getLast = function(){
		return this.tail.content;
	}

	this.append = function(content){
		if(this.size == 0){
			this.tail = new ListNode(content);
			this.head = this.tail;
		} else {
			this.tail.setNext(new ListNode(content));
			this.tail.next.setPrevious(this.tail);
			this.tail = this.tail.next;
		}
		this.size++;
	}

	this.prepend = function(content){
		if(this.size == 0){
			this.tail = new ListNode(content);
			this.head = this.tail;
		} else {
			this.head.setPrevious(new ListNode(content));
			this.head.previous.setNext(this.head);
			this.head = this.head.previous;
		}
		this.size++;
	}

	this.add = function(content,idx){
		if(this.size<=idx) this.append(content);
		else if(idx == 0) this.prepend(content);
		else {
			var node = new ListNode(content);
			var current = this.head;
			for(var i=0;i<idx;i++){
				current = current.next;
			}
			node.setNext(current);
			node.setPrevious(current.previous);
			current.previous.setNext(node);
			current.setPrevious(node);
		}
		this.size++;
	}

	this.contains = function(content){
		if(this.size == 0) return false;
		var current = this.head;
		var done = false;
		while(true){
			if(current.content === content){
				return true;
			} else {
				if(current.next == null) return false;
				current = current.next;
			}
		}		
	}
}

function ListNode(content){
	this.content = content;
	this.next = null;
	this.previous = null;

	this.setNext = function(node){
		this.next = node;
	}

	this.setPrevious = function(node){
		this.previous = node;
	}
}