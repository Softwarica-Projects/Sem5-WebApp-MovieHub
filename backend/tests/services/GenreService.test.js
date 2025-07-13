const GenreService = require('../../src/services/GenreService');
const GenreRepository = require('../../src/repositories/GenreRepository');
const { ValidationException, NotFoundException, ConflictException } = require('../../src/exceptions');

describe('GenreService', () => {
    let genreService;
    let mockGenreRepository;
    let mockGenre;

    beforeEach(() => {
        mockGenreRepository = {
            findByName: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByNameExcludingId: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            findAllSorted: jest.fn()
        };

        genreService = new GenreService();
        genreService.genreRepository = mockGenreRepository;

        mockGenre = {
            _id: global.mockId(),
            name: 'Action',
            image: '/images/action.jpg',
            toObject: function() {
                return { _id: this._id, name: this.name, image: this.image };
            }
        };
    });

    describe('validateGenreData', () => {
        it('should validate valid genre data', () => {
            const validData = {
                name: 'Action',
            };

            expect(() => genreService.validateGenreData(validData)).not.toThrow();
        });

        it('should throw ValidationException for missing name', () => {
            const invalidData = {
                description: 'Action movies description'
            };

            expect(() => genreService.validateGenreData(invalidData)).toThrow(ValidationException);
        });

        it('should throw ValidationException for short name', () => {
            const invalidData = {
                name: 'A',
                description: 'Action movies description'
            };

            expect(() => genreService.validateGenreData(invalidData)).toThrow(ValidationException);
        });
    });

    describe('createGenre', () => {
        it('should create genre successfully with image', async () => {
            const genreData = {
                name: 'Action',
            };

            mockGenreRepository.findByName.mockResolvedValue(null);
            mockGenreRepository.create.mockResolvedValue(mockGenre);

            const result = await genreService.createGenre(genreData, '/images/action.jpg');

            expect(mockGenreRepository.findByName).toHaveBeenCalledWith(genreData.name);
            expect(mockGenreRepository.create).toHaveBeenCalledWith({
                name: genreData.name,
                image: '/images/action.jpg'
            });
            expect(result).toEqual(mockGenre);
        });

        it('should create genre without image', async () => {
            const genreData = {
                name: 'Action',
            };

            mockGenreRepository.findByName.mockResolvedValue(null);
            mockGenreRepository.create.mockResolvedValue(mockGenre);

            const result = await genreService.createGenre(genreData);

            expect(mockGenreRepository.create).toHaveBeenCalledWith({
                name: genreData.name,
                image: null
            });
            expect(result).toEqual(mockGenre);
        });

        it('should throw ConflictException for existing genre name', async () => {
            const genreData = {
                name: 'Action',
            };

            mockGenreRepository.findByName.mockResolvedValue(mockGenre);

            await expect(genreService.createGenre(genreData)).rejects.toThrow(ConflictException);
        });
    });

    describe('updateGenre', () => {
        it('should update genre successfully', async () => {
            const genreData = {
                name: 'Updated Action',
            };

            mockGenreRepository.findById.mockResolvedValue(mockGenre);
            mockGenreRepository.findByNameExcludingId.mockResolvedValue(null);
            mockGenreRepository.updateById.mockResolvedValue({ ...mockGenre, ...genreData });

            const result = await genreService.updateGenre(mockGenre._id, genreData);

            expect(mockGenreRepository.findById).toHaveBeenCalledWith(mockGenre._id);
            expect(mockGenreRepository.findByNameExcludingId).toHaveBeenCalledWith(genreData.name, mockGenre._id);
            expect(mockGenreRepository.updateById).toHaveBeenCalledWith(mockGenre._id, {
                name: genreData.name
            });
            expect(result).toEqual({ ...mockGenre, ...genreData });
        });

        it('should update genre with image', async () => {
            const genreData = {
                name: 'Updated Action',
            };

            mockGenreRepository.findById.mockResolvedValue(mockGenre);
            mockGenreRepository.findByNameExcludingId.mockResolvedValue(null);
            mockGenreRepository.updateById.mockResolvedValue({ ...mockGenre, ...genreData });

            const result = await genreService.updateGenre(mockGenre._id, genreData, '/images/updated.jpg');

            expect(mockGenreRepository.updateById).toHaveBeenCalledWith(mockGenre._id, {
                name: genreData.name,
                image: '/images/updated.jpg'
            });
            expect(result).toEqual({ ...mockGenre, ...genreData });
        });

        it('should throw ValidationException for invalid genre ID', async () => {
            const genreData = {
                name: 'Updated Action',
            };

            await expect(genreService.updateGenre('invalid-id', genreData)).rejects.toThrow(ValidationException);
        });

        it('should throw NotFoundException for non-existent genre', async () => {
            const genreData = {
                name: 'Updated Action',
            };

            mockGenreRepository.findById.mockResolvedValue(null);

            await expect(genreService.updateGenre(mockGenre._id, genreData)).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException for existing genre name', async () => {
            const genreData = {
                name: 'Updated Action',
            };

            mockGenreRepository.findById.mockResolvedValue(mockGenre);
            mockGenreRepository.findByNameExcludingId.mockResolvedValue({ _id: 'otherId' });

            await expect(genreService.updateGenre(mockGenre._id, genreData)).rejects.toThrow(ConflictException);
        });
    });

    describe('getGenres', () => {
        it('should get all genres with formatted image URLs', async () => {
            const basePath = 'http://localhost:3000';
            mockGenreRepository.findAllSorted.mockResolvedValue([mockGenre]);

            const result = await genreService.getGenres(basePath);

            expect(mockGenreRepository.findAllSorted).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].image).toBe(`${basePath}${mockGenre.image}`);
        });

        it('should handle genres without image URLs', async () => {
            const basePath = 'http://localhost:3000';
            const genreWithoutImage = { ...mockGenre, image: null };
            mockGenreRepository.findAllSorted.mockResolvedValue([genreWithoutImage]);

            const result = await genreService.getGenres(basePath);

            expect(result[0].image).toBeNull();
        });
    });

    describe('getGenreById', () => {
        it('should get genre by id with formatted image URL', async () => {
            const basePath = 'http://localhost:3000';
            mockGenreRepository.findById.mockResolvedValue(mockGenre);

            const result = await genreService.getGenreById(mockGenre._id, basePath);

            expect(mockGenreRepository.findById).toHaveBeenCalledWith(mockGenre._id);
            expect(result.image).toBe(`${basePath}${mockGenre.image}`);
        });

        it('should throw ValidationException for invalid genre ID', async () => {
            await expect(genreService.getGenreById('invalid-id', 'http://localhost:3000')).rejects.toThrow(ValidationException);
        });

        it('should throw NotFoundException for non-existent genre', async () => {
            mockGenreRepository.findById.mockResolvedValue(null);

            await expect(genreService.getGenreById(mockGenre._id, 'http://localhost:3000')).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteGenre', () => {
        it('should delete genre successfully', async () => {
            mockGenreRepository.deleteById.mockResolvedValue(mockGenre);

            const result = await genreService.deleteGenre(mockGenre._id);

            expect(mockGenreRepository.deleteById).toHaveBeenCalledWith(mockGenre._id);
            expect(result).toEqual({ message: 'Genre deleted successfully' });
        });

        it('should throw ValidationException for invalid genre ID', async () => {
            await expect(genreService.deleteGenre('invalid-id')).rejects.toThrow(ValidationException);
        });

        it('should throw NotFoundException for non-existent genre', async () => {
            mockGenreRepository.deleteById.mockResolvedValue(null);

            await expect(genreService.deleteGenre(mockGenre._id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getGenreByName', () => {
        it('should get genre by name', async () => {
            mockGenreRepository.findByName.mockResolvedValue(mockGenre);

            const result = await genreService.getGenreByName('Action');

            expect(mockGenreRepository.findByName).toHaveBeenCalledWith('Action');
            expect(result).toEqual(mockGenre);
        });

        it('should return null for non-existent genre', async () => {
            mockGenreRepository.findByName.mockResolvedValue(null);

            const result = await genreService.getGenreByName('NonExistent');

            expect(mockGenreRepository.findByName).toHaveBeenCalledWith('NonExistent');
            expect(result).toBeNull();
        });
    });
});