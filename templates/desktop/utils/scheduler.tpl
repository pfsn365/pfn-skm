<script type="text/javascript">
  function runAsBackgroundTask(task) {
    if ("scheduler" in window && "postTask" in scheduler) {
      return window.scheduler.postTask(task, { priority: "background" });
    }

    return new Promise(function(resolve) {
      window.setTimeout(function() {
        resolve(task());
      }, 0);
    });
  }

  {* Ref: https://web.dev/articles/optimize-long-tasks#defer-code-execution *}
  {* Returns a promise *}
  function yieldToMain() {
    if ("scheduler" in window && "yield" in window.scheduler) {
      return window.scheduler.yield();
    }

    {* Fall back to yielding with setTimeout. *}
    return new Promise(function(resolve) {
      window.setTimeout(function() {
        resolve();
      }, 0);
    });
  }
</script>
