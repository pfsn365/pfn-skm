<script>
    function selectSimulationOption(value, name) {
        var radioInput = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
        if (radioInput) {
            radioInput.checked = true;
            changeSimulationOption(value);
        }
    }

    function changeSimulationOption(option) {
        var optionContainer = $("." + option);
        if (optionContainer) {
            var previousSelected = $('.radio-option-container.selected');
            if (previousSelected) {
                if (hasClass(previousSelected, "selected")) {
                    removeClass(previousSelected, "selected");
                }
            }
            if (!hasClass(optionContainer, "selected")) {
                addClass(optionContainer, "selected");
            }
        }
    }

    function selectOptionContainer(e) {
        var selectedOptionContainer = e.target.closest('div');
        var isDisabled = selectedOptionContainer.classList.contains('disabled-option');
        var selectedOption = selectedOptionContainer.getAttribute('data-option');
        var simulationType = selectedOptionContainer.getAttribute('data-simulation-type');

        if (selectedOption && simulationType && !isDisabled) {
            selectSimulationOption(selectedOption, simulationType);
        }
    }

    function addPopUpEventListeners() {
        var optionContainers = document.getElementsByClassName("radio-option-container");

        for (var containerIndex = 0; containerIndex < optionContainers.length; containerIndex++) {
            optionContainers[containerIndex].addEventListener('click', selectOptionContainer);
        }
    }
</script>

