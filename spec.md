# spec for a portfolio site

## general
- styles should be extremely minimalist, modern. nothing flashy
    - the only animations are: 
        - 1. on page load, the heading line uses a typed animation as it prints in
        - 2. on scroll, new elements fade in and out very subtley
- colour pallette is black and white, simple. varying shades can be used for low/highlighting
- use monospace fonts or give the site a slight terminal feel
- one scrollable page
- website is perfectly responsive to everything from a cellphone screen to a 4k TV
- use nextjs, with bun as package manager
- use native tools where possible
- use tailwind
- maintain an internal component library
- assume postgres for a database

## features

### hero section
- simple heading: hello, i'm zing - typing animation. 
- 2 sentence introduction: I'm a passionate developer and outdoor activity enjoyer. I develop software in payments and corporate finance and have keen interests in web development and blockchain
- links to github, x, linkedin, contact via discord, x, email (all icons)
- location/timezone

### software intro
- github stats overview
    - calendar (black and white)
    - stars
    - small list of projects I've stared
    - pinned projects
    - followers, follows, or other stats like prs, commits, issues, etc. 
    - most used technologies, etc

### project timeline
- scrollable timeline, latest first, top to bottom
- two sections, left and right, timeline in center
- left side: professional projects(these cards are left aligned)
    - these are cards that include a organization and organization icon, role, project heading, description, technologies(including icons for langauges, frameworks, etc)
- right side: personal projects(these cards are right aligned)
    - cards which include a project heading, image, description, link, github link, technologies(including icons for languages, frameworks, etc)
- important: this section loads only the first latest 10 projects. when the user has scrolled past the last loaded project, a "Load more" button appears, and if they click it, 10 more projects load. If they do not, they are able to scroll past this section and continue to the next. 
- professional and personal projects are displayed in amongst each other, based on their start time in descending order. a timeline indicating years runs centrally.

### light footer section
- please get in touch if you would like to chat about software

### backoffice cms
- the site has a backoffice cms that can be accessed by going to a specific path on the url
- an admin will be presented a login page where they can login
- once logged in, the admin can maintain the projects list of the website
