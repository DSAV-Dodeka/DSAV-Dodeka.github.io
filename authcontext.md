# AuthContext

Contex is a way to share values throughout a React application without having to explicitly pass a prop throughout the whole tree. According to the [official guide on context](https://reactjs.org/docs/context.html#when-to-use-context), 'the current authenticated user' is a good use-case.

The 'context' is a class that is very similar to a global useState. 
The `createContext` function from React creates the `AuthContext` object using a default value. Since we do not yet want to set its value, we define `IAuth` (an interface) containing `authState` and `setAuthState` and use an empty version of it as the default.

The `authState` attribute of the AuthContext is an `AuthState` object, which we defined ourselves. This is a TypeScript class, containing some basic information on the user and authentication status.

We export the `AuthContext.Provider`, which is the component that will wrap our entire app, allowing each subcomponent to access the context.

We only want to set the default value once, once the application starts. Furthermore, the initialization requires asynchronous calls that can only be made at runtime. This can be tricky, so to prevent any problems we use the `useEffect` hook to initialize everything on the first render. The AuthProvider is initially initialized with an empty AuthState, which is then populated asynchronously.

The initialization uses our custom `useAuth` function, which contains most of the logic. We should write tests for this.

There are 3 tokens, ID token (from OpenID Connect, not actually used for authorization), access token (used for all authorized requests) and refresh token (used to refresh access and ID token). The ID token is transparent to the front end, meaning it is guaranteed we can read its data. It is used to see the username and other useful profile information to personalize the website. The "expiry" returned by a token request relates to the expiry time of the ID token (10 hours, 3600 s). 

The `useAuth` function will check if it has stored tokens and parse the ID token value to populate the `user` attribute of the context's authState. If the token is expired, it will automatically request a new one using the refresh token. If it is missing, it simply assumes the user is not logged in.