<navigation class="header">
  
    

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#">UMTG</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a id="navPage{pageKey}" class="nav-item nav-link" onClick={ onClick(pageKey) } each={ pageKey in this.opts.pages } href="#">{ pageKey }</a>
                </div>
            </div>
            </nav>
    <style>

        navigation {
            background: linear-gradient(var(--color-header), black);
            color: white;
        }

        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        li {
            float: left;
        }

        a {
            display: block;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
            color: var(--color--background);
        }

        li:hover {
            background-color: var(--color-background);
            color: var(--color-font-fg);
        }

        li.active:hover {
        }

        li.active{
            background-color: var(--color-background);
            background: linear-gradient(var(--color-background), darkgray);
            color: var(--color-font-fg);
        }

        .navLogo {
            font-weight: bold;
        }
    </style>

    <script>
        onClick(page) {
            return function(e) {
                this.opts.onPageSelected(page)
                var elements = document.getElementsByClassName("nav-item");
                for (var i = 0; i < elements.length; ++i) {
                    elements[i].classList.remove("active");
                    if (elements[i].id == "navPage" + page) {
                        elements[i].classList.add("active");
                    }

                }

            }
        }



        this.on("mount", function () {
            var elements = document.getElementsByClassName("nav-item");
            elements[0].classList.add("active")
        });
    </script>

</navigation>
