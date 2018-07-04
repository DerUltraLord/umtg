<set class="list-group-item">
    <div class="row">
        <div class="col-2">
            <img class="" src={ this.opts.set.icon_svg_uri }></img>
        </div>
        <div class="col-10">
            <span class="badge badge-default">{ this.opts.set.name }</span>
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div> 
            </div>
        </div>
    <style>

        img {
            width: 20px;
            height: 20px;
            margin-left: 5px;
        }




    </style>

    <script>
        this.on('mount', () => {
            db.getPercentageOfSet(this.opts.set)
            .then(this.updatePercentage)
            .catch(console.error);

        });

        this.updatePercentage = (percentage) => {

            if (percentage > 0) {
                let width = percentage * 100;
                $(this.root).find('.progress-bar').css("width", width + '%');
            }
        };

    </script>
</set>
