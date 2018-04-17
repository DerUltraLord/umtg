<set>
    <img src={this.opts.set.icon_svg_uri} width="16px" height="16px"></img>
    <label>{this.opts.set.name}</label>


    <style>
        set {
            display: grid;
            grid-gap: 0px;
            grid-template-columns: 20px 1fr;
        }

        img {
            width: 16px;
            height: 16px;
            background-color: white;
        }


        label {
            font-size: 50%;
            border-bottom: 1px solid var(--color-brown);
        }

    </style>

    <script>
    </script>
</set>
