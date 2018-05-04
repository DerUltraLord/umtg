<set>
    <img src={this.opts.set.icon_svg_uri}></img>
    <div class="progress" data-label="{this.opts.set.name}">
        <span class="value" style="width:20%;"></span>
    </div> 


    <style>
        set {
            display: grid;
            grid-gap: 0px;
            grid-template-columns: 40px 1fr;
            height: 30px;
            background-color: var(--color-background-two);
        }

        img {
            width: 20px;
            height: 20px;
            margin-left: 5px;
        }

        .progress {
            margin-top: 1px;
            height: 29px;
            width: 100%;
            background-color: #c9c9c9;
            position: relative;
        }

        .progress:before {
            content: attr(data-label);
            position: absolute;
            text-align: left;
            top: 5px;
            left: 0;
            right: 0;
            margin-left: 10px;
        }

        .progress .value {
            background-color: #7cc4ff;
            display: inline-block;
            height: 100%;
        }

    </style>

    <script>
    </script>
</set>
