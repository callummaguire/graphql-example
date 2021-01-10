# Welcome to Graphql example

This repo is to show a example of graphql work flow. They are concept that are important such as mutations and queries. To see unserstand this please look at the graphql documentation
[Graphql Docs](https://graphql.org/)


# Getting Started

## Frontend
The frontend is a next application for some reason but doesnt really matter. 

    yarn dev
   The server comes up on port 3000 

    yarn gen
   
   

 This command will generate new documenation from the graphql backend. it will generate a hook that is visible in the generated/graphql.tsx. 

## Backend
The requirement for running the backend is to have postgres installed with a database name of 'example'.

To get the backend up and running the command is:

    yarn dev:watch



this will get the server up and running on port 4000 and have nodemon watch for file changes in the backend.

Please also install redis if you want to use login page.
    
[Redis](https://redis.io/download)