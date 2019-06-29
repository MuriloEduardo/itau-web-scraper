const puppeteer = require("puppeteer");

module.exports = async credentials => {
    //
    // Configurações
    //
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://www.itau.com.br/index.html", {
        waitUntil: "networkidle2"
    });

    //
    // Agencia e Conta
    //
    await page.waitForSelector("#campo_agencia");

    await page.type("#campo_agencia", credentials.agency);
    await page.type("#campo_conta", credentials.account);

    await page.click(".btnSubmit");

    //
    // Senha
    //
    await page.waitForSelector("#senha");

    const keys = await page.evaluate(resultsSelector => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));
        return anchors.map(anchor => {
            return anchor.textContent.trim();
        });
    }, "a.campoTeclado");

    const getKeyText = digit => {
        return keys.filter(key => {
            return key.indexOf(digit) != -1;
        });
    };

    const arrPassword = Array.from(credentials.password);

    for (let index = 0; index < arrPassword.length; index++) {
        const digit = arrPassword[index];
        await page.$eval(`[aria-label='${getKeyText(digit)}']`, btn =>
            btn.click()
        );
    }

    await page.$eval("#acessar", btn => btn.click());

    //
    // Click para extrato completo
    await page.waitForSelector("#exibirBoxContaCorrente .botoes a.itau-button");

    await page.$eval("#exibirBoxContaCorrente .botoes a.itau-button", btn =>
        btn.click()
    );

    //
    // Seta o filtro para extratos dos últimos 90 dias
    //
    await page.waitForSelector("#select-filtrarPeriodo select");

    await page.select("#select-filtrarPeriodo select", "90");

    //
    // Retorna tabela de extratos
    //
    await page.waitForSelector("#gridLancamentos-pessoa-fisica");

    const extractTable = await page.evaluate(() => {
        const rows = Array.from(
            document.querySelectorAll(
                "#gridLancamentos-pessoa-fisica tbody tr.linha-impressao"
            )
        );

        let balance = document.querySelector(
            "#conteudo-saldo-resumido span:not(#titulo-box-saldo)"
        ).innerText;

        balance = balance.replace("R$ ", "");

        const extract = rows.map(row => {
            let date = row.querySelector(
                "td:first-child span.element--accessHide"
            ).innerText;

            let description = row
                .querySelector("td:nth-child(2) > span")
                .innerText.trim();

            let value =
                row.querySelector("td:nth-child(3) span.element--accessHide") ||
                row.querySelector("td:nth-child(3)");

            value = value.innerText;

            return {
                date,
                description,
                value
            };
        });

        return {
            extract,
            balance
        };
    });

    await browser.close();

    return extractTable;
};
