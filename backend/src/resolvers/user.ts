import { Resolver, InputType, Field, Mutation, Arg, Ctx, ObjectType, Query } from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType() 
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User) 
    async me(
        @Ctx() {req, em}: MyContext
    ) {
        if (!req.session!.userId) {
            return null;
        }
        const user = em.findOne(User, { id: req.session!.userId});
        return user;
    }
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ) {
        const hashedPassword = await argon2.hash(options.password); 
        const user = em.create(User, {username: options.username, password: hashedPassword});
        try {
            await em.persistAndFlush(user);
        } catch(error) {
            if (error.code === '23505') {
                return { errors: [{
                    field: "username",
                    message: "username already taken",
                }]}
            }
        }
        return {user};
    }


    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username});
        
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: 'username not found'
                }]
            };
        }
        const valid = await argon2.verify(user.password, options.password); 

        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'incorrect password'
                }]
            }; 
        }

        req.session!.userId = user.id;

        return {user};
    }
}