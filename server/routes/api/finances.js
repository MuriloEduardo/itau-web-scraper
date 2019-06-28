const express = require("express");

const User = require("../../models/User");
const Finance = require("../../models/Finance");

const scraper = require("../../scraper");

const router = express.Router();

router.post("/", async (req, res) => {
    const { account } = req.body;

    try {
        // Busca se ja existe um usuario com essas credenciais
        let user = await User.findOne({ account });

        // Se não existe cria
        if (!user) user = await User.create(req.body);

        // Remove o ultimo extrato deste usuario
        await Finance.deleteMany({ user: user.id });

        // Scrpaer para pegar um novo extrato deste usuario
        const scraperData = await scraper(req.body);

        // Cria novo extrato
        const finance = await Finance.create({ ...scraperData, user: user.id });

        return res.send(finance);
    } catch (error) {
        return res.status(400).send({ error: "Registration failed" });
    }
});

module.exports = router;
