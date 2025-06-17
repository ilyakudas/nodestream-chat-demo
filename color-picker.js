document.addEventListener('DOMContentLoaded', function () {
    const colorPicker = new iro.ColorPicker('.color-picker-widget', {
        width: 280,
        color: "#f00"
    });

    const hexValue = document.querySelector('#hex-value input');
    const rgbValue = document.querySelector('#rgb-value input');
    const hslValue = document.querySelector('#hsl-value input');

    function updateColorValues(color) {
        hexValue.value = color.hexString;
        rgbValue.value = color.rgbString;
        hslValue.value = color.hslString;
    }

    colorPicker.on('color:change', updateColorValues);

    updateColorValues(colorPicker.color);

    document.querySelectorAll('.color-value button').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            input.select();
            document.execCommand('copy');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1500);
        });
    });
});
