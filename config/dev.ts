import dotenv from 'dotenv'
dotenv.config({ path: '.env.dev' })

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
        NETWORK_ID: 'testnet',
        NODE_URL: 'https://rpc.testnet.near.org',
    },
}
