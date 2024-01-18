import * as nearAPI from 'near-api-js'
import config from 'config'
import logger from 'utils/logger'

const NEAR_CONNECTION_CONFIG = config.get<{
    NETWORK_ID: string
    NODE_URL: string
}>('NEAR_CONNECTION_CONFIG')

const CONTRACT_ID = config.get<string>('CONTRACT_ID')

interface contractMethods {
    get_key_hash(args: { accountId: string }): Promise<string>
}

const connectionConfig = {
    networkId: NEAR_CONNECTION_CONFIG.NETWORK_ID,
    nodeUrl: NEAR_CONNECTION_CONFIG.NODE_URL,
    keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
}

let contractInstance: contractMethods | null = null

export const initContract = async () => {
    try {
        const near = await nearAPI.connect(connectionConfig)
        const account = await near.account(CONTRACT_ID)
        contractInstance = new nearAPI.Contract(account, CONTRACT_ID, {
            viewMethods: ['get_key_hash'],
            changeMethods: [],
            useLocalViewExecution: true,
        }) as unknown as contractMethods
    } catch (e) {
        logger.error(e)
    }
}

export const getKeyHash = async (accountId: string) => {
    const response = await contractInstance!.get_key_hash({ accountId })
    return response
}
