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
    .navLogo {
        color: lightgreen;
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
                console.log(elements[i].id == "nav"+page)
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