export interface User {
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    photo: string,
}

const fakeUser: User = {
    id: 1,
    name: "Kaique Mesquita Alves",
    email: "kaqueiabandonou@gmail.com",
    phone: "(15) 99830-0231",
    address: "Rua das Maritacas, 293",
    password: "senhaHashed",
    photo: "user.png"
}

const userService = {
    async getUsers() : Promise<User[]> {
        return [fakeUser];
    }
}

export default userService