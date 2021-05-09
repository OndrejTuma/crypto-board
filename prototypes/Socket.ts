function Socket(url: string): void {
  this.isOpened = false
  this.socket = null
  this.url = url
}

Socket.prototype.open = function (onOpen) {
  this.socket = new WebSocket(this.url)

  this.socket.addEventListener('open', () => {
    this.isOpened = true
    onOpen?.()
  })
}

Socket.prototype.send = function (data) {
  if (!this.socket) {
    throw new Error('Cannot send data, socket is not opened. Call Socket.open() first. ' + this.url)
  }

  this._socketOperation(() => this.socket.send(JSON.stringify(data)))
}

Socket.prototype.message = function (onMessage) {
  if (!this.socket) {
    throw new Error('Cannot listen to message event, socket is not opened. Call Socket.open() first. ' + this.url)
  }

  this.socket.addEventListener('message', onMessage)
}

Socket.prototype.close = function () {
  this.socket?.close()
}

Socket.prototype._socketOperation = function (callback) {
  if (this.isOpened) {
    callback?.()
  } else {
    this.socket.addEventListener('open', callback)
  }
}

export default Socket