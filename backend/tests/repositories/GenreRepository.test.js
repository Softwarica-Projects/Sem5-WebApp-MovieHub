const GenreRepository = require('../../src/repositories/GenreRepository');
const Genre = require('../../src/models/genreModel');

jest.mock('../../src/models/genreModel');

describe('GenreRepository', () => {
    let genreRepository;
    let mockGenre;

    beforeEach(() => {
        genreRepository = new GenreRepository();
        mockGenre = {
            _id: global.mockId(),
            name: 'Action',
            description: 'Action movies',
            imageUrl: '/images/action.jpg'
        };

        Genre.findOne = jest.fn();
        Genre.find = jest.fn();
        Genre.prototype.save = jest.fn();
    });

    describe('findByName', () => {
        it('should find genre by name', async () => {
            Genre.findOne.mockResolvedValue(mockGenre);
            
            const result = await genreRepository.findByName('Action');
            
            expect(Genre.findOne).toHaveBeenCalledWith({ name: 'Action' });
            expect(result).toEqual(mockGenre);
        });

        it('should return null if genre not found', async () => {
            Genre.findOne.mockResolvedValue(null);
            
            const result = await genreRepository.findByName('NonExistent');
            
            expect(result).toBeNull();
        });
    });

    describe('findByNameExcludingId', () => {
        it('should find genre by name excluding specific id', async () => {
            const excludeId = global.mockId();
            Genre.findOne.mockResolvedValue(mockGenre);
            
            const result = await genreRepository.findByNameExcludingId('Action', excludeId);
            
            expect(Genre.findOne).toHaveBeenCalledWith({ 
                name: 'Action', 
                _id: { $ne: excludeId } 
            });
            expect(result).toEqual(mockGenre);
        });

        it('should return null if no genre found with criteria', async () => {
            const excludeId = global.mockId();
            Genre.findOne.mockResolvedValue(null);
            
            const result = await genreRepository.findByNameExcludingId('Action', excludeId);
            
            expect(result).toBeNull();
        });
    });

    describe('findAllSorted', () => {
        it('should find all genres sorted by name', async () => {
            const mockGenres = [
                { ...mockGenre, name: 'Action' },
                { ...mockGenre, name: 'Comedy' },
                { ...mockGenre, name: 'Drama' }
            ];
            
            const mockQuery = {
                sort: jest.fn().mockResolvedValue(mockGenres)
            };
            Genre.find.mockReturnValue(mockQuery);
            
            const result = await genreRepository.findAllSorted();
            
            expect(Genre.find).toHaveBeenCalledWith({});
            expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
            expect(result).toEqual(mockGenres);
        });

        it('should return empty array if no genres found', async () => {
            const mockQuery = {
                sort: jest.fn().mockResolvedValue([])
            };
            Genre.find.mockReturnValue(mockQuery);
            
            const result = await genreRepository.findAllSorted();
            
            expect(result).toEqual([]);
        });
    });
});
