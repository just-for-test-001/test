- To give you more context about this project "Overlays Project", is that currently Rexel Webshop is migrated partially from Hybris to Angular and follows MFE architecture (with native federation), but modals and sidepanels still in old Hybris and some of it in Angular inside MFEs.
  So the idea of this project is to migrate all these modals and sidepanels into this library, publish it, and install it in MFEs that needs any modal/sidepanl.
- Modals and Sidepanels can be used in multiple MFEs and each MFE can use multiple modal, so that why we export each component as a standalone sub package so each MFE loads only modals it needs, and also we will add it in federation.config to load it as singleton to prevent loading modal multiple times if used in many MFEs in same time.
- These modals / sidepanels will have business logic, we try to encapsulate all it's logic inside of it, so MFE will just plug & play, MFE will just import the modal/sidepanel controls its opening, and we accept inputs & outputs for MFE customization or for data that only MFE know it or something like that. But API calls, redirections, business logic, ..etc all this will be handled by modal/sidepanel itself.
- For translations, we will load it once in Shell MFE so transations will be accessible for all our modals/sidepanels.
- Modals & sidepanels can have 2 different triggers, instant modals/sidepanels that opens instantly when we do an action, and timed out modals/sidepanels that opens after a while for example the modals that opens after 30min of inactivity.
- These modals will use our design system components (@rexel/shared-components) : Button, Modal (accepts header title, footer actions, and content component), SidePanel (accepts same as Modal), Typography, ...etc (more than 20 components) (i didn't install it here because i'm not on company VPN and it's private package)
- Rexel webshop is multitenant webshop (by banner), rexel webshop has regions : EMEA (europe), APAC (aust), AMER (canada). And each region has multiple banners : frx (france), gyw (germany), cnd (canada nedco), ..etc. And each banner supports 1 or 2 languages, for example NEDCO is supporting "fr" and "en", so we are using locale to load translations : locale = BANNER_LANGUAGE.
- Each banner has it's own theme (colors, fonts, ...etc), and we use our design system @rexel/themes to load themes on shell and i will use it to load themes also for storybook so we can test themes also (theme service we have now it's just a dummy service to test themes loading, i added it because i cannot install it's private package)
- We created Storybook to not install the library everytime in MFEs for testing, we will use it for local development.
- The dev cycle will be : we have modals and sidepanels designed on Figma (figma contains tokens : design system components used and themes used), and the sepc of Jira tickets (context, scenarios, how to trigger it, use cases, API doc if modal has API calls, ...etc), and we create component and it's story, once it's validated we integrate it inside MFE. For modals/sidepanels that has API calls and external services calls that we cannot call inside storybook we will create mock with exactly identical as real service (same response, same errors, same states ...etc) and we will use in storybook. So in storybook we test visual and mock data, and real data we test it when we integrate modal/sidepanel in MFE.
- Our manager, asks us to try to create an AI coding agent that will take figma URL (modal/sidepanel selection in figma), Jira ticket number and try to create end 2 end modal/sidepanel component.
- So i'm thinking of using Figma MCP to get figma nodes json, and to get Jira ticket description in markdown using bash and GQL, create folder in root of this projects and create folder for each modal/sidepanel and put there figma.json (nodes json), jira.md (jira spec) and use it for implementation and use AI skills to give AI capabilities. And for AI agant to test what he does if correct will use unit tests and storybook interactions tests.
- Im thinking of this approach & skills structure :
  - /.agents/skills
    - /rexel-webshop
      - SKILL.md : the idea of this skill is to AI context about our rexel webshop and all general subject should know about webshop (for specific subjects it will be in jira spec)
      - /references
        - banner.md : explain regions, banners, languages, locales, url construction (because always we a banner prefix /banner/URL except for germany we don't have banner in url)
        - ...other general subjects
    - /design-system-components
      - SKILL.md : the idea it to give it context of all components we have and how to use each one
      - /refrences
        - component-1.md
        - component-2.md
        - ...etc
    - /design-system-themes
      - SKILL.md : the idea it to give it context of all themes we have and it's based on banner
      - /refrences
        - frx.md
        - gyw.md
        - ...etc
    - /workspace
      - SKILL.md : the idea of this skill is to explain to it how we sctrucure our angular workspace...etc
      - /references
        - folder-structure.md : overview about our workspace folder structure (components, services, stories, translations...etc)
        - conventions.md : conventions (naming, rules, ...etc)
        - storybook-story.md : how to create story scenario to match real usage (usage of DS components only and not create new componnets only for story, and not over exaggerate in scenario, scenario by type of triggering...etc)
        - storybook-documentation.md : how to create a complete .mdx story for documentation with sections to have ...etc (title, desc, usage, component api, using business logic in documentation explainings, resources (figma), ...etc)
    - /testings
      - SKILL.md : the idea of this skill is to teach it how to write tests & mocks
      - /references
        - mocks.md : to explain api services mocks and data mocks and usage in storybook ...etc
        - unit-tests.md : why we wrote unit tests, when we wrote it, for what we wrote it, and what we should test in it
        - interactions-tests.md : why we wrote interactions tests, when we wrote it, for what we wrote it, and what we should test in it (i'm planning to write these groups of tests : visual tests (colors, fonts, sizes, ..etc without layout and positions because it not reliable to be tested in interactions tests). Data tests : api data, wordings, translations, ..etc. Interactions tests : actions, events, clicks, ...etc)
    - /spec
      - SKILL.md : idea of this skill is to teach how to get spec from diff sources (figma, jira, local file)
      - /refrences
        - figma.md : explain figma organisation we follow, tokens of ds components & themes, nodes json...etc (to understand figma design)
        - jira.md : meant to understand jira spec (jira spec doesnt have a defined structure)

(NOTES : Components and themes i created now in this project are dummy components just for testing poerposes because i cannot install @rexel/shared-components and @rexel/themes because it's private packages)

I want you to read & understand the context of this Overlays Project 100%, ask me questions if you don't understand something.
And review all my AI subject decisions.
Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.
Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.
I want you to audit adverserially (red team audit), review constructively, documment progressively.
Then i want you to help me write & setup these skills from A to Z.

---

---

---

---

---

- To give you more context about this project "Overlays Project", is that currently Rexel Webshop is migrated partially from Hybris to Angular and follows MFE architecture (with native federation), but modals and sidepanels still in old Hybris and some of it in Angular inside MFEs.
  So the idea of this project is to migrate all these modals and sidepanels into this library, publish it, and install it in MFEs that needs any modal/sidepanl.
- Modals and Sidepanels can be used in multiple MFEs and each MFE can use multiple modal, so that why we export each component as a standalone sub package so each MFE loads only modals it needs, and also we will add it in federation.config to load it as singleton to prevent loading modal multiple times if used in many MFEs in same time.
- These modals / sidepanels will have business logic, we try to encapsulate all it's logic inside of it, so MFE will just plug & play, MFE will just import the modal/sidepanel controls its opening, and we accept inputs & outputs for MFE customization or for data that only MFE know it or something like that. But API calls, redirections, business logic, ..etc all this will be handled by modal/sidepanel itself.
- For translations, we will load it once in Shell MFE so transations will be accessible for all our modals/sidepanels.
- Modals & sidepanels can have 2 different triggers, instant modals/sidepanels that opens instantly when we do an action, and timed out modals/sidepanels that opens after a while for example the modals that opens after 30min of inactivity.
- These modals will use our design system components (@rexel/shared-components) : Button, Modal (accepts header title, footer actions, and content component), SidePanel (accepts same as Modal), Typography, ...etc (more than 20 components) (i didn't install it here because i'm not on company VPN and it's private package)
- Rexel webshop is multitenant webshop (by banner), rexel webshop has regions : EMEA (europe), APAC (aust), AMER (canada). And each region has multiple banners : frx (france), gyw (germany), cnd (canada nedco), ..etc. And each banner supports 1 or 2 languages, for example NEDCO is supporting "fr" and "en", so we are using locale to load translations : locale = BANNER_LANGUAGE.
- Each banner has it's own theme (colors, fonts, ...etc), and we use our design system @rexel/themes to load themes on shell and i will use it to load themes also for storybook so we can test themes also (theme service we have now it's just a dummy service to test themes loading, i added it because i cannot install it's private package)
- We created Storybook to not install the library everytime in MFEs for testing, we will use it for local development.
- The dev cycle will be : we have modals and sidepanels designed on Figma (figma contains tokens : design system components used and themes used), and the sepc of Jira tickets (context, scenarios, how to trigger it, use cases, API doc if modal has API calls, ...etc), and we create component and it's story, once it's validated we integrate it inside MFE. For modals/sidepanels that has API calls and external services calls that we cannot call inside storybook we will create mock with exactly identical as real service (same response, same errors, same states ...etc) and we will use in storybook. So in storybook we test visual and mock data, and real data we test it when we integrate modal/sidepanel in MFE.
- Our manager, asks us to try to create an AI coding agent that will take figma URL (modal/sidepanel selection in figma), Jira ticket number and try to create end 2 end modal/sidepanel component.

- So i'm thinking of using Figma MCP to get figma nodes json, and to get Jira ticket description in markdown using bash and GQL, create folder in root of this projects and create folder for each modal/sidepanel and put there figma.json (nodes json), jira.md (jira spec) and use it for implementation and use AI skills to give AI capabilities. And for AI agant to test what he does if correct will use unit tests and storybook interactions tests.
- Here is list of skills i'm thinking that we'll need :
  - rexel webshop general infos skill : the idea of this skill is to AI context about our rexel webshop and all general subject should know about webshop (for specific subjects it will be in jira spec), for example explain regions, banners, languages, locales, webshop URLs format (because always we prefix url with banner /banner/URL except for germany we don't have banner in url)
  - library folder structure & conventions skill : skill to explain to agent how to create a new modal/sidepanel in lib library from A to Z (structure, naming, ...etc)
  - translations skill : skill to explain to agent how to create translations (uppercase naming, object per modal/sidepanel, file per locale ...etc)
  - storybook folder structure & conventions skill : skill to explain to agent how to create a new modal/sidepanel story in storybook app from A to Z (structure, naming, ...etc)
  - storybook story scenario skill : how to create story scenario to match real usage of modal/sidepanel, usage of DS components only and not create new componnets only for story, and not over exaggerate in scenario, scenario by type of triggering...etc
  - storybook documentation skill : how to write a complete .mdx doc for a modal/sidepanel, sections to include (title, description, usage, component api, resources like figma url, ...etc), using business logic explains in writing doc ...stc
  - unit tests skill : why we wrote unit tests, when we wrote it, for what we wrote it, and what we should test in it ...etc
  - intercations tests skill : why we wrote interactions tests, when we wrote it, for what we wrote it, and what we should test in it (visual, data, interactions) ...etc
  - mocks skill : how to write mocks for external services (api, ...etc), what to mock, usage in storybook ...etc
  - design system components skills : skill to give to agent context about all components we have in design system and how to use each one (i will extract skill of each component from design system's storybook docs)
  - design system themes skill : skill to give to agent all tokens we have (colors, fonts, ...etc), it's diff by banner, ..etc (NOTE THAT THEMES I PUT IN assets/ FOLDER ARE JUST DUMMY DATA FOR TEST, REAL THEMES WILL BE LOADED BY @rexel/themes PRIVATE PACKEGE)
  - figma skill : skill that will help and instruct agent to understand figma nodes json and convert it to angular, our figma will contain tokens and names from design system for components and themes (agent should not wait for 100% token name comparaison to get component used it should try to figure out it and understand it from figma)...etc
  - jira skill : skill that will help agent to understand jira spec (this spec will be used in implementation, testing and documentation)...etc
  - skill about the overlay project itself for giving context to agent what he is building

(NOTES : Components and themes i created now in this project are dummy components just for testing poerposes because i cannot install @rexel/shared-components and @rexel/themes because it's private packages)

I want you to read & understand the context of this Overlays Project 100%, ask me questions if you don't understand something.
And review all my AI subject decisions.
Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.
Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.
I want you to audit adverserially (red team audit), review constructively, documment progressively.
Then i want you to help me write & setup these skills from A to Z.
