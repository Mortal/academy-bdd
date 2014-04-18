import academy.settings

def settings(request):
    return {'SERVER_GENERATED_JSX': academy.settings.SERVER_GENERATED_JSX}
