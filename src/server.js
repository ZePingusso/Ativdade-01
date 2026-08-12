import app from './app.js';
import 'dotenv/config';

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`
        Servidor rodando na porta ${PORT},
        http://localhost:${PORT}`
    );
});