# Rexel Webshop Banner

This document provides general context about the Rexel Webshop that the AI agent needs to understand.

## Overview

Rexel is a global electrical distribution company. The Rexel Webshop is an e-commerce platform being migrated from Hybris (legacy) to Angular v19 with a Micro-Frontend (MFE) architecture using native federation.

## Multi-Tenant Architecture (by Banner)

The webshop is **multi-tenant by banner**. A "banner" is a brand/identity under which the webshop operates in a specific market.

### Regions & Banners

| Region               | Country        | Brand                     | Banner | Website (PROD)                       |
| -------------------- | -------------- | ------------------------- | ------ | ------------------------------------ |
| Europe (EMEA)        | France         | Rexel France              | frx    | https://www.rexel.fr/frx/            |
| Europe (EMEA)        | France         | Sofinther                 | sof    | https://www.sofinther.fr/sof/        |
| Europe (EMEA)        | Germany        | Rexel                     | gyw    | https://www.rexel.de/                |
| Europe (EMEA)        | Austria        | Schaecke (Schäcke)        | aus    | https://www.schaecke.at/aus/         |
| Europe (EMEA)        | Austria        | Regro                     | aur    | https://www.regro.at/aur/            |
| Europe (EMEA)        | Netherlands    | Rexel                     | nln    | https://www.rexel.nl/nln/            |
| Europe (EMEA)        | Sweden         | Rexel                     | swe    | https://www.rexel.se/swe/            |
| Europe (EMEA)        | United Kingdom | Rexel UK                  | uki    | https://www.rexel.co.uk/uki/         |
| North America (AMER) | Canada         | Nedco                     | cnd    | https://www.nedco.ca/cnd/            |
| North America (AMER) | Canada         | Westburne                 | cwr    | https://www.westburne.ca/cwr/        |
| North America (AMER) | Canada         | Rexel Atlantic            | cra    | https://atlantic.rexel.ca/cra/       |
| Asia-Pacific (APAC)  | Australia      | Rexel Electrical Supplies | are    | https://www.rexel.com.au/are/        |
| Asia-Pacific (APAC)  | Australia      | John R Turk               | ajt    | https://www.jrt.com.au/ajt/          |
| Asia-Pacific (APAC)  | Australia      | Ideal Electrical          | aie    | https://www.idealelectrical.com/aie/ |
| Asia-Pacific (APAC)  | Australia      | Lear & Smith              | als    | https://www.learsmith.com.au/als/    |

> **Note:** Nedco (cnd) supports 3 regions : Ontario (excluding Ottawa), Western Canada, Quebec & Eastern Canada (including Ottawa).
> **Note:** Westburne (cwr) supports 4 regions : Ontario (excluding Ottawa), British Columbia, Alberta & Northwest Territories, Saskatchewan, Manitoba & Northern Ontario, Quebec & New Brunswick.

### Languages and Locale Format

Locale = `{banner}_{language}` (e.g., `frx_fr`, `cnd_en`, `gyw_de`)

This format is used for translation file naming: `assets/i18n/frx_fr.json`

| Banner | Supported Languages           | Locale Format      |
| ------ | ----------------------------- | ------------------ |
| frx    | French (`fr`)                 | `frx_fr`           |
| sof    | French (`fr`)                 | `sof_fr`           |
| gyw    | German (`de`)                 | `gyw_de`           |
| aus    | German (`de`)                 | `aus_de`           |
| aur    | German (`de`)                 | `aur_de`           |
| nln    | Dutch (`nl`)                  | `nln_nl`           |
| swe    | Swedish (`sv`)                | `swe_sv`           |
| uki    | English (`en`)                | `uki_en`           |
| cnd    | English (`en`), French (`fr`) | `cnd_en`, `cnd_fr` |
| cwr    | English (`en`), French (`fr`) | `cwr_en`, `cwr_fr` |
| cra    | French (`fr`)                 | `cra_fr`           |
| are    | English (`en`)                | `are_en`           |
| ajt    | English (`en`)                | `ajt_en`           |
| aie    | English (`en`)                | `aie_en`           |
| als    | English (`en`)                | `als_en`           |

### URL format

URLs include the banner code in the path, except for Germany (gyw) which does not.

**Example:**

| Page       | Banner | URL                              |
| ---------- | ------ | -------------------------------- |
| Login page | frx    | `https://www.rexel.fr/frx/login` |
| Login page | cnd    | `https://www.nedco.ca/cnd/login` |
| Login page | gyw    | `https://www.rexel.de/login`     |
