import fs from 'fs'
export const royaltieClearB64 = "I3ByYWdtYSB2ZXJzaW9uIDYKaW50IDEKcmV0dXJu"
export const royaltieB64 = Buffer.from(
    fs.readFileSync("./RoyaltiePolicyApplicationTemplate_APPROVAL")
).toString("base64")
