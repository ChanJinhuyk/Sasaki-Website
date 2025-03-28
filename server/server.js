require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const db = require('./db');

const app = express();

// Middleware Sécurité
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(',')
}));

// Limite de taux pour éviter le spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration Email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Validation des données
const validateContact = [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('message').trim().notEmpty().withMessage('Le message est requis')
];

// Route pour les messages
app.post('/api/contact', validateContact, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, service, message } = req.body;

    try {
        // Sauvegarde en base de données
        await db.saveMessage(name, email, service, message);

        // Envoi d'email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Nouveau message de ${name} - Service: ${service || 'Non spécifié'}`,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Service intéressé:</strong> ${service || 'Non spécifié'}</p>
                <h3>Message:</h3>
                <p>${message}</p>
                <hr>
                <p>Cet email a été envoyé depuis le formulaire de contact de votre site web.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Réponse au client
        res.status(200).json({
            success: true,
            message: 'Message envoyé avec succès'
        });

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors de l\'envoi du message'
        });
    }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});