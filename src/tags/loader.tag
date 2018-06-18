<loader>
    <div show={ this.loading } class="background"><div>
    <div show={ this.loading } class="loader" id="loader"></div>

    <style>
        .old {
            margin: auto;
            margin-top: 100px;
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
         }
        
        .background {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #000;
            opacity: 0.5;
            z-index: 1000;
        }

        .loader {
            position: absolute;
            top: 20%;
            left: 50%;
            z-index: 99;
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
         }


        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .hide-loader{
            display:none;
        }
    </style>

    <script type="es6">
        
        this.loading = false;

        this.show = () => {
            this.loading = true;
            this.update();
        };

        this.hide = () => {
            this.loading = false;
            this.update();
        };


    </script>
</loader>
