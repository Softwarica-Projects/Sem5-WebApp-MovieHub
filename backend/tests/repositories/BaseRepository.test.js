const BaseRepository = require('../../src/repositories/BaseRepository');
const { ServerException } = require('../../src/exceptions');

class MockModel {
    constructor(data) {
        this.data = data;
        this._id = global.mockId();
    }

    async save() {
        return this;
    }

    toObject() {
        return { ...this.data, _id: this._id };
    }

    static findById(id) {
        const query = {
            populate: () => query,
            sort: () => query,
            select: () => query,
            exec: () => new MockModel({ _id: id })
        };
        return query;
    }

    static findOne(filter) {
        const query = {
            populate: () => query,
            sort: () => query,
            select: () => query,
            exec: () => new MockModel(filter)
        };
        return query;
    }

    static find(filter = {}) {
        const query = {
            populate: () => query,
            sort: () => query,
            select: () => query,
            exec: () => [new MockModel(filter)]
        };
        return query;
    }

    static async findByIdAndUpdate(id, data, options) {
        return new MockModel({ _id: id, ...data });
    }

    static async findByIdAndDelete(id) {
        return new MockModel({ _id: id });
    }

    static async countDocuments(filter) {
        return 1;
    }

    static async exists(filter) {
        return true;
    }

    populate(path) {
        return this;
    }

    sort(criteria) {
        return this;
    }

    select(fields) {
        return this;
    }

    exec() {
        return this;
    }
}

MockModel.modelName = 'MockModel';

describe('BaseRepository', () => {
    let repository;

    beforeEach(() => {
        repository = new BaseRepository(MockModel);
    });

    describe('create', () => {
        it('should create a new document', async () => {
            const data = { name: 'Test' };
            const result = await repository.create(data);
            expect(result).toBeDefined();
            expect(result.data).toEqual(data);
        });

        it('should throw ServerException on error', async () => {
            const originalSave = MockModel.prototype.save;
            MockModel.prototype.save = jest.fn().mockRejectedValue(new Error('Save failed'));
            
            await expect(repository.create({})).rejects.toThrow(ServerException);
            
            MockModel.prototype.save = originalSave;
        });
    });

    describe('findById', () => {
        it('should find document by id', async () => {
            const id = global.mockId();
            const mockData = { _id: id, name: 'Test' };
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'findById').mockReturnValue(mockQuery);
            
            const result = await repository.findById(id);
            expect(result).toBeDefined();
            expect(result).toEqual(mockData);
            
            MockModel.findById.mockRestore();
        });

        it('should find document by id with populate', async () => {
            const id = global.mockId();
            const mockData = { _id: id, name: 'Test' };
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'findById').mockReturnValue(mockQuery);
            
            const result = await repository.findById(id, 'field');
            expect(result).toBeDefined();
            expect(mockQuery.populate).toHaveBeenCalledWith('field');
            expect(result).toEqual(mockData);
            
            MockModel.findById.mockRestore();
        });

        it('should throw ServerException on error', async () => {
            MockModel.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
            
            await expect(repository.findById(global.mockId())).rejects.toThrow(ServerException);
        });
    });

    describe('findOne', () => {
        it('should find one document', async () => {
            const filter = { name: 'Test' };
            const mockData = { _id: '1', name: 'Test' };
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'findOne').mockReturnValue(mockQuery);
            
            const result = await repository.findOne(filter);
            expect(result).toBeDefined();
            expect(result).toEqual(mockData);
            
            MockModel.findOne.mockRestore();
        });

        it('should find one document with populate', async () => {
            const filter = { name: 'Test' };
            const mockData = { _id: '1', name: 'Test' };
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'findOne').mockReturnValue(mockQuery);
            
            const result = await repository.findOne(filter, 'field');
            expect(result).toBeDefined();
            expect(mockQuery.populate).toHaveBeenCalledWith('field');
            expect(result).toEqual(mockData);
            
            MockModel.findOne.mockRestore();
        });

        it('should throw ServerException on error', async () => {
            MockModel.findOne = jest.fn().mockRejectedValue(new Error('Find failed'));
            
            await expect(repository.findOne({})).rejects.toThrow(ServerException);
        });
    });

    describe('find', () => {
        it('should find documents', async () => {
            const mockData = [{ _id: '1', name: 'Test' }];
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'find').mockReturnValue(mockQuery);
            
            const result = await repository.find();
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(mockData);
            
            MockModel.find.mockRestore();
        });

        it('should find documents with filter', async () => {
            const filter = { name: 'Test' };
            const mockData = [{ _id: '1', name: 'Test' }];
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'find').mockReturnValue(mockQuery);
            
            const result = await repository.find(filter);
            expect(result).toBeDefined();
            expect(result).toEqual(mockData);
            
            MockModel.find.mockRestore();
        });

        it('should find documents with populate', async () => {
            const mockData = [{ _id: '1', name: 'Test' }];
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'find').mockReturnValue(mockQuery);
            
            const result = await repository.find({}, 'field');
            expect(result).toBeDefined();
            expect(mockQuery.populate).toHaveBeenCalledWith('field');
            expect(result).toEqual(mockData);
            
            MockModel.find.mockRestore();
        });

        it('should find documents with sort', async () => {
            const mockData = [{ _id: '1', name: 'Test' }];
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'find').mockReturnValue(mockQuery);
            
            const result = await repository.find({}, null, { name: 1 });
            expect(result).toBeDefined();
            expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
            expect(result).toEqual(mockData);
            
            MockModel.find.mockRestore();
        });

        it('should find documents with select', async () => {
            const mockData = [{ _id: '1', name: 'Test' }];
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
                then: function(resolve) { return this.exec().then(resolve); }
            };
            
            jest.spyOn(MockModel, 'find').mockReturnValue(mockQuery);
            
            const result = await repository.find({}, null, null, 'name');
            expect(result).toBeDefined();
            expect(mockQuery.select).toHaveBeenCalledWith('name');
            expect(result).toEqual(mockData);
            
            MockModel.find.mockRestore();
        });

        it('should throw ServerException on error', async () => {
            MockModel.find = jest.fn().mockRejectedValue(new Error('Find failed'));
            
            await expect(repository.find()).rejects.toThrow(ServerException);
        });
    });

    describe('updateById', () => {
        it('should update document by id', async () => {
            const id = global.mockId();
            const data = { name: 'Updated' };
            const result = await repository.updateById(id, data);
            expect(result).toBeDefined();
        });

        it('should throw ServerException on error', async () => {
            MockModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Update failed'));
            
            await expect(repository.updateById(global.mockId(), {})).rejects.toThrow(ServerException);
        });
    });

    describe('deleteById', () => {
        it('should delete document by id', async () => {
            const id = global.mockId();
            const result = await repository.deleteById(id);
            expect(result).toBeDefined();
        });

        it('should throw ServerException on error', async () => {
            MockModel.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Delete failed'));
            
            await expect(repository.deleteById(global.mockId())).rejects.toThrow(ServerException);
        });
    });

    describe('countDocuments', () => {
        it('should count documents', async () => {
            const result = await repository.countDocuments();
            expect(result).toBe(1);
        });

        it('should count documents with filter', async () => {
            const filter = { name: 'Test' };
            const result = await repository.countDocuments(filter);
            expect(result).toBe(1);
        });

        it('should throw ServerException on error', async () => {
            MockModel.countDocuments = jest.fn().mockRejectedValue(new Error('Count failed'));
            
            await expect(repository.countDocuments()).rejects.toThrow(ServerException);
        });
    });

    describe('exists', () => {
        it('should check if document exists', async () => {
            const filter = { name: 'Test' };
            const result = await repository.exists(filter);
            expect(result).toBe(true);
        });

        it('should throw ServerException on error', async () => {
            MockModel.exists = jest.fn().mockRejectedValue(new Error('Exists failed'));
            
            await expect(repository.exists({})).rejects.toThrow(ServerException);
        });
    });
});
