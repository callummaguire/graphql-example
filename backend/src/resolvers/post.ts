import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Ctx() {em}: MyContext): Promise<Post[]>
    {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true})
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: MyContext): Promise<Post | null>
    {
        return em.findOne(Post, {id});
    }

    @Mutation(() => Post, { nullable: true})
    async createPost(
        @Arg('title') title: string,
        @Ctx() {em}: MyContext): Promise<Post>
    {
        const newPost = em.create(Post, {title})
        await em.persistAndFlush(newPost);
        return newPost
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id') id: number,
        @Arg('title') title: string,
        @Ctx() {em}: MyContext): Promise<Post | null>
    {
        const foundPost = await em.findOne(Post, {id});
        if (!foundPost) {
            return null;
        }
        if (typeof title !== 'undefined'){
            foundPost.title = title;
            await em.persistAndFlush(foundPost);
        }
        return foundPost;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext): Promise<boolean>
    {
        await em.nativeDelete(Post, {id});
        return true
    }
}