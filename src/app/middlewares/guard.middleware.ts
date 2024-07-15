class Guard {
  private static instance: Guard;
  private constructor() {}

  static get(): Guard {
    if (!this.instance) {
      this.instance = new Guard();
    }
    return this.instance;
  }
}

const instance = Guard.get();

export { instance as Guard };
