import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const { PORT, MONGO_URI, SIGNER_PUBLIC, SIGNER_PRIVATE, CONTRACT_ID } =
    process.env

export default {
    PORT,
    MONGO_URI,
    CONTRACT_ID,
    SIGNER: {
        PUBLIC: SIGNER_PUBLIC,
        PRIVATE: SIGNER_PRIVATE,
    },
    NEAR_CONNECTION_CONFIG: {
        NETWORK_ID: 'mainnet',
        NODE_URL: 'https://rpc.mainnet.near.org',
    },
}
