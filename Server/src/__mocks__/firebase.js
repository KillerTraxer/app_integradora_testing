module.exports = {
    initializeApp: jest.fn(),
    credential: {
        cert: jest.fn()
    },
    firestore: {
        collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
                get: jest.fn().mockResolvedValue({
                    exists: true,
                    data: () => ({ fcmTokens: [] })
                }),
                update: jest.fn().mockResolvedValue()
            })
        })
    }
};