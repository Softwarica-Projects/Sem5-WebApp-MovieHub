class GenreController {
    constructor(Genre) {
        this.Genre = Genre;
    }

    async createGenre(req, res) {
        try {
            const { name } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : null;
            
            const genre = new this.Genre({ name, image });
            await genre.save();

            res.status(201).json({ message: 'Genre created successfully', genre });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getGenres(req, res) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const genres = await this.Genre.find();

            const genresWithBasePath = genres.map(genre => ({
                ...genre.toObject(),
                image: genre.image ? `${basePath}${genre.image}` : null,
            }));

            res.status(200).json(genresWithBasePath);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getGenreById(req, res) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const genre = await this.Genre.findById(req.params.id);
            if (!genre) {
                return res.status(404).json({ message: 'Genre not found' });
            }
            const genreWithBasePath = {
                ...genre.toObject(),
                image: genre.image ? `${basePath}${genre.image}` : null,
            };

            res.status(200).json(genreWithBasePath);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateGenre(req, res) {
        try {
            const { name } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : undefined;

            const updateData = { name };
            if (image) {
                updateData.image = image;
            }

            const genre = await this.Genre.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!genre) {
                return res.status(404).json({ message: 'Genre not found' });
            }

            res.status(200).json({ message: 'Genre updated successfully', genre });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteGenre(req, res) {
        try {
            const genre = await this.Genre.findByIdAndDelete(req.params.id);
            if (!genre) {
                return res.status(404).json({ message: 'Genre not found' });
            }
            res.status(200).json({ message: 'Genre deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = GenreController;