const HOST: string = "localhost";
const PORT: number = 8080

export const TestCodeEndpoint = `http://${HOST}:${PORT}/api/coapi/test`;
export const AllProblemEndpoint = `http://${HOST}:${PORT}/api/db/problem`
export const CreateProblemEndpoint = `http://${HOST}:${PORT}/api/db/problem`
export const RenderMarkdownEndpoint = `http://${HOST}:${PORT}/api/markdown/render`
export const SignUpEndpoint = `http://${HOST}:${PORT}/api/auth/signup`
export const LoginEndpoint = `http://${HOST}:${PORT}/api/auth/login`
export const MeEndpoint = `http://${HOST}:${PORT}/api/auth/me`
export const GetUserDetailsEndpoint = `http://${HOST}:${PORT}/api/db/user/{}`
