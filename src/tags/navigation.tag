<navigation class="header">
  
    
    <ul>
        <li>
            <a class="navLogo" href="#">UMTG</a>
        <li>
        <li id="navPage{pageKey}" class="navElement" each={pageKey in this.opts.pages} id="nav{pageKey}" onClick={ parent.onClick(pageKey) }>
            <a href="#">{pageKey}</a>
        </li>
    </ul>
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
                var elements = document.getElementsByClassName("navElement");
                for (var i = 0; i < elements.length; ++i) {
                    elements[i].classList.remove("active");
                    if (elements[i].id == "navPage" + page) {
                        elements[i].classList.add("active");
                    }

                }

            }
        }



        this.on("mount", function () {
            var elements = document.getElementsByClassName("navElement");
            elements[0].classList.add("active")
        });
    </script>

</navigation>
