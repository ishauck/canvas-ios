import { CanvasAPI } from "canvas-client";

export const verifyCanvas = async (domain: string, accessToken: string) => {
    const canvas = new CanvasAPI(`https://${domain}`, [accessToken]);
    const user = await canvas.getUser();
    
    return user;
}