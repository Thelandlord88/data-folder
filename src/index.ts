import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req: Request, res: Response) => {
    try {
        const data = req.body;
        console.log('Received webhook data:', data);
        
        // Process the webhook data here
        const response = {
            status: 'success',
            message: 'Webhook received successfully',
            data: data
        };
        
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`TypeScript webhook server running on port ${PORT}`);
});
