export class User {
    constructor(first, last, age) {
        this.first = first
        this.last = last
    }
}

export class ExpandedUser extends User {
    constructor(user, profession, location) {
        super(user.first, user.last, user.age)
        // Set additional fields as needed
        // this.profession = profession
        // this.location = location
    }
}

/* Non-critical data types for use in testing */
export class City {
    constructor(name, state) {
        this.name = name
        this.state = state
    }
}

export class Hobby {
    constructor(isActive, length, isFree) {
        this.isActive = isActive
        this.length = length
        this.isFree = isFree
    }
}

export class Instruments {
    constructor(isSolo, price, isTransportable) {
        this.isSolo = isSolo
        this.price = price
        this.isTransportable = isTransportable
    }
}
/* END Non-critical data types */
